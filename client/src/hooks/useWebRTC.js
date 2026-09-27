import { useEffect, useRef, useState, useCallback } from "react";
import { socket } from "../services/socket";

// Public STUN server so peers behind NAT can discover their public address.
// For real deployments beyond simple NATs you would add a TURN server too.
const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

/**
 * Encapsulates all WebRTC + signaling logic for one meeting room.
 * Redux is intentionally NOT used here: RTCPeerConnection and MediaStream
 * objects are not serializable and don't belong in the Redux store, so they
 * are kept in refs/component state instead, as the project spec requires.
 */
export default function useWebRTC(roomId, currentUser) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({}); // socketId -> { stream, name, micOn, cameraOn }
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaError, setMediaError] = useState(null);

  const peerConnections = useRef({}); // socketId -> RTCPeerConnection
  const localStreamRef = useRef(null);
  const cameraTrackRef = useRef(null); // saved camera track so we can restore it after screen share

  const createPeerConnection = useCallback((socketId, name) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Send our local tracks to this new peer
    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { to: socketId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: {
          ...(prev[socketId] || {}),
          stream: event.streams[0],
          name: prev[socketId]?.name || name,
          micOn: prev[socketId]?.micOn ?? true,
          cameraOn: prev[socketId]?.cameraOn ?? true,
        },
      }));
    };

    peerConnections.current[socketId] = pc;
    return pc;
  }, []);

  const closePeerConnection = (socketId) => {
    peerConnections.current[socketId]?.close();
    delete peerConnections.current[socketId];
    setRemoteStreams((prev) => {
      const copy = { ...prev };
      delete copy[socketId];
      return copy;
    });
  };

  // 1. Get camera/mic, then connect the socket and join the room
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) return;
        localStreamRef.current = stream;
        cameraTrackRef.current = stream.getVideoTracks()[0];
        setLocalStream(stream);
      } catch (err) {
        setMediaError(
          "Camera/microphone permission was denied or unavailable. You can still join with them muted."
        );
      }

      socket.connect();
      socket.emit("join-room", { roomId, userId: currentUser._id, name: currentUser.name });
    };

    start();

    // ---- signaling listeners ----
    socket.on("existing-participants", async (participants) => {
      for (const p of participants) {
        const pc = createPeerConnection(p.socketId, p.name);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { to: p.socketId, offer });
      }
    });

    socket.on("user-joined", ({ socketId, name }) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: { ...(prev[socketId] || {}), name, micOn: true, cameraOn: true },
      }));
    });

    socket.on("offer", async ({ from, offer }) => {
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    });

    socket.on("answer", async ({ from, answer }) => {
      const pc = peerConnections.current[from];
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = peerConnections.current[from];
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn("Failed to add ICE candidate", err);
        }
      }
    });

    socket.on("user-left", ({ socketId }) => closePeerConnection(socketId));

    socket.on("camera-toggle", ({ socketId, cameraOn: on }) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: { ...(prev[socketId] || {}), cameraOn: on },
      }));
    });

    socket.on("mic-toggle", ({ socketId, micOn: on }) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: { ...(prev[socketId] || {}), micOn: on },
      }));
    });

    return () => {
      cancelled = true;
      socket.emit("leave-room");
      socket.off("existing-participants");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("user-left");
      socket.off("camera-toggle");
      socket.off("mic-toggle");
      socket.disconnect();

      Object.keys(peerConnections.current).forEach(closePeerConnection);
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const toggleMic = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
    socket.emit("mic-toggle", { roomId, micOn: track.enabled });
  };

  const toggleCamera = () => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
    socket.emit("camera-toggle", { roomId, cameraOn: track.enabled });
  };

  // Replace the outgoing video track in every peer connection (used for screen share)
  const replaceOutgoingVideoTrack = (newTrack) => {
    Object.values(peerConnections.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track && s.track.kind === "video");
      if (sender) sender.replaceTrack(newTrack);
    });
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      replaceOutgoingVideoTrack(screenTrack);
      setIsScreenSharing(true);
      socket.emit("screen-share-start", { roomId });

      // Auto-restore the camera when the user stops sharing via the browser's own UI
      screenTrack.onended = () => stopScreenShare();
    } catch (err) {
      setMediaError("Screen sharing permission was denied.");
    }
  };

  const stopScreenShare = () => {
    if (cameraTrackRef.current) replaceOutgoingVideoTrack(cameraTrackRef.current);
    setIsScreenSharing(false);
    socket.emit("screen-share-stop", { roomId });
  };

  return {
    localStream,
    remoteStreams,
    micOn,
    cameraOn,
    isScreenSharing,
    mediaError,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  };
}
