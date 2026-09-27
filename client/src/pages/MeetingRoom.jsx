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
import {
  getMeeting,
  clearCurrentMeeting,
} from "../features/meetings/meetingSlice";

export default function MeetingRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentMeeting, status, error } = useSelector(
    (state) => state.meeting
  );

  const [activePanel, setActivePanel] = useState(null);
  // null | chat | whiteboard | files

  useEffect(() => {
    dispatch(getMeeting(roomId));

    return () => dispatch(clearCurrentMeeting());
  }, [dispatch, roomId]);

  const {
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
  } = useWebRTC(roomId, user);

  const participantCount = Object.keys(remoteStreams).length + 1;

  const handleLeave = () => {
    navigate("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="meeting-message">
        Joining meeting...
      </div>
    );
  }

  if (error) {
    return (
      <div className="meeting-message">
        <p className="meeting-error">
          {error}
        </p>

        <button
          className="btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="meeting-room">

      {/* Header */}
      <div className="glass-panel meeting-header">

        <Logo size={28} />

        <div className="meeting-header-info">
          <div className="meeting-title">
            {currentMeeting?.title || "Meeting"}
          </div>

          <div className="text-muted meeting-room-info">
            Room: {roomId} · {participantCount} participant
            {participantCount !== 1 ? "s" : ""}
          </div>
        </div>

      </div>

      {/* Media Error */}
      {mediaError && (
        <p className="meeting-media-error">
          {mediaError}
        </p>
      )}

      {/* Main Meeting Area */}
      <div className="meeting-content">

        {/* Video Area */}
        <div className="video-area">
          <VideoGrid
            localStream={localStream}
            localName={user.name}
            micOn={micOn}
            cameraOn={cameraOn}
            remoteStreams={remoteStreams}
          />
        </div>

        {/* Side Panel */}
        {activePanel && (
          <div className="glass-panel meeting-side-panel">

            {activePanel === "chat" && (
              <ChatPanel
                roomId={roomId}
                currentUser={user}
              />
            )}

            {activePanel === "whiteboard" && (
              <Whiteboard roomId={roomId} />
            )}

            {activePanel === "files" && (
              <FileShare roomId={roomId} />
            )}

          </div>
        )}

      </div>

      {/* Controls */}
      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        isScreenSharing={isScreenSharing}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={
          isScreenSharing
            ? stopScreenShare
            : startScreenShare
        }
        activePanel={activePanel}
        onSetPanel={setActivePanel}
        onLeave={handleLeave}
      />

    </div>
  );
}