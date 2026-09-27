import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { uploadFile } from "../features/meetings/meetingSlice";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function FileShare({ roomId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const loadFiles = async () => {
    try {
      const { data } = await api.get(`/files/${roomId}`);
      setFiles(data);
    } catch {
      setError("Could not load files for this meeting.");
    }
  };

  useEffect(() => { loadFiles(); }, [roomId]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const result = await dispatch(uploadFile({ file, meetingId: roomId }));
    setUploading(false);
    if (uploadFile.rejected.match(result)) {
      setError(result.payload || "Upload failed");
    } else {
      loadFiles();
    }
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: 12 }}>
        <label className="btn-primary" style={{ display: "inline-block" }}>
          {uploading ? "Uploading..." : "Share a File"}
          <input type="file" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
        </label>
        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>{error}</p>}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
        {files.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No files shared yet.</p>}
        {files.map((f) => (
          <div
            key={f._id}
            className="glass-panel"
            style={{ padding: 10, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <div style={{ fontSize: 14 }}>{f.fileName}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>
                {formatSize(f.fileSize)} · {f.uploadedBy?.name || "Unknown"}
              </div>
            </div>
            <a
              className="btn-secondary"
              href={`${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${f.filePath}`}
              target="_blank" rel="noreferrer"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
