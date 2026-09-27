// Bottom control bar: mic, camera, screen share, panel switches, leave.
export default function MeetingControls({
  micOn, cameraOn, isScreenSharing,
  onToggleMic, onToggleCamera, onToggleScreenShare,
  activePanel, onSetPanel, onLeave,
}) {
  const panelButton = (key, label) => (
    <button
      className={activePanel === key ? "btn-primary" : "btn-secondary"}
      onClick={() => onSetPanel(activePanel === key ? null : key)}
      aria-label={label}
    >
      {label}
    </button>
  );

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "center",
        padding: 14, margin: "0 16px 16px", overflowX: "auto",
      }}
    >
      <button className={micOn ? "btn-secondary" : "btn-danger"} onClick={onToggleMic} aria-label="Toggle microphone">
        {micOn ? "🎤 Mic" : "🔇 Muted"}
      </button>
      <button className={cameraOn ? "btn-secondary" : "btn-danger"} onClick={onToggleCamera} aria-label="Toggle camera">
        {cameraOn ? "📷 Camera" : "🚫 Camera Off"}
      </button>
      <button className={isScreenSharing ? "btn-primary" : "btn-secondary"} onClick={onToggleScreenShare} aria-label="Toggle screen share">
        🖥️ {isScreenSharing ? "Stop Share" : "Share Screen"}
      </button>
      {panelButton("chat", "💬 Chat")}
      {panelButton("whiteboard", "🖌️ Whiteboard")}
      {panelButton("files", "📁 Files")}
      <button className="btn-danger" onClick={onLeave} aria-label="Leave meeting">
        📞 Leave
      </button>
    </div>
  );
}
