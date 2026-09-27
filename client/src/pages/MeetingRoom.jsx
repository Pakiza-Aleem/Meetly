import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useWebRTC from "../hooks/useWebRTC";
import VideoGrid from "../components/VideoGrid";
import MeetingControls from "../components/MeetingControls";
import ChatPanel from "../components/ChatPanel";
import Whiteboard from "../components/Whiteboard";
import FileShare from "../components/FileShare";
import Logo from "../components/Logo";
import { getMeeting, clearCurrentMeeting } from "../features/meetings/meetingSlice";

export default function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentMeeting, status, error } = useSelector((state) => state.meeting);
  const [activePanel, setActivePanel] = useState(null); // null | chat | whiteboard | files

  useEffect(() => {
    dispatch(getMeeting(roomId));
    return () => dispatch(clearCurrentMeeting());
  }, [dispatch, roomId]);

  const {
    localStream, remoteStreams, micOn, cameraOn, isScreenSharing, mediaError,
    toggleMic, toggleCamera, startScreenShare, stopScreenShare,
  } = useWebRTC(roomId, user);

  const participantCount = Object.keys(remoteStreams).length + 1;

  const handleLeave = () => navigate("/dashboard");

  if (status === "loading") {
    return <div style={{ padding: 40, textAlign: "center" }}>Joining meeting...</div>;
  }
  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "var(--danger)" }}>{error}</p>
        <button className="btn-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        className="glass-panel"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", margin: 16, borderRadius: 14 }}
      >
        <Logo size={28} />
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600 }}>{currentMeeting?.title || "Meeting"}</div>
          <div className="text-muted" style={{ fontSize: 12 }}>
            Room: {roomId} · {participantCount} participant{participantCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {mediaError && (
        <p style={{ color: "var(--danger)", textAlign: "center", fontSize: 13 }}>{mediaError}</p>
      )}

      <div style={{ display: "flex", flex: 1, overflow: "hidden", gap: 0 }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <VideoGrid
            localStream={localStream}
            localName={user.name}
            micOn={micOn}
            cameraOn={cameraOn}
            remoteStreams={remoteStreams}
          />
        </div>

        {activePanel && (
          <div className="glass-panel" style={{ width: 340, margin: "0 16px 0 0", display: "flex", flexDirection: "column" }}>
            {activePanel === "chat" && <ChatPanel roomId={roomId} currentUser={user} />}
            {activePanel === "whiteboard" && <Whiteboard roomId={roomId} />}
            {activePanel === "files" && <FileShare roomId={roomId} />}
          </div>
        )}
      </div>

      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={isScreenSharing ? stopScreenShare : startScreenShare}
        activePanel={activePanel}
        onSetPanel={setActivePanel}
        onLeave={handleLeave}
      />
    </div>
  );
}
