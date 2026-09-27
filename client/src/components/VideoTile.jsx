import { useEffect, useRef } from "react";

// A single reusable participant video tile, used for both local and remote streams.
export default function VideoTile({ stream, name, muted = false, micOn = true, cameraOn = true, isLocal = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      className="glass-panel"
      style={{ position: "relative", overflow: "hidden", aspectRatio: "16/10", background: "#0B1914" }}
    >
      {cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: isLocal ? "scaleX(-1)" : "none" }}
        />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--emerald-dark)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700,
            }}
          >
            {name?.[0]?.toUpperCase() || "?"}
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute", bottom: 8, left: 8, display: "flex", alignItems: "center", gap: 6,
          background: "rgba(6,17,13,0.65)", padding: "4px 10px", borderRadius: 8, fontSize: 12,
        }}
      >
        <span>{name || "Participant"}{isLocal ? " (You)" : ""}</span>
        <span>{micOn ? "🎤" : "🔇"}</span>
      </div>
    </div>
  );
}
