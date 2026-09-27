import VideoTile from "./VideoTile";

// Responsive grid of all participant video tiles (local + remote).
export default function VideoGrid({ localStream, localName, micOn, cameraOn, remoteStreams }) {
  const remoteEntries = Object.entries(remoteStreams);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        padding: 16,
      }}
    >
      <VideoTile stream={localStream} name={localName} muted isLocal micOn={micOn} cameraOn={cameraOn} />
      {remoteEntries.map(([socketId, info]) => (
        <VideoTile
          key={socketId}
          stream={info.stream}
          name={info.name}
          micOn={info.micOn}
          cameraOn={info.cameraOn}
        />
      ))}
    </div>
  );
}
