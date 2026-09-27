import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createMeeting, getMeetings } from "../features/meetings/meetingSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { meetings, status } = useSelector((state) => state.meeting);
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { dispatch(getMeetings()); }, [dispatch]);

  const handleCreate = async () => {
    setCreating(true);
    const result = await dispatch(createMeeting("New Meeting"));
    setCreating(false);
    if (createMeeting.fulfilled.match(result)) {
      navigate(`/meeting/${result.payload.roomId}`);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (joinCode.trim()) navigate(`/meeting/${joinCode.trim()}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div className="glass-panel" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Create Meeting</h3>
            <p className="text-muted" style={{ fontSize: 13 }}>Start an instant meeting and share the code with others.</p>
            <button className="btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? "Creating..." : "New Meeting"}
            </button>
          </div>

          <div className="glass-panel" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0 }}>Join Meeting</h3>
            <form onSubmit={handleJoin} style={{ display: "flex", gap: 10 }}>
              <input
                style={{ flex: 1 }} placeholder="Enter meeting code"
                value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
              />
              <button className="btn-secondary" type="submit">Join Meeting</button>
            </form>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: 24, marginBottom: 40 }}>
          <h3 style={{ marginTop: 0 }}>Recent Meetings</h3>
          {status === "loading" && <p className="text-muted">Loading meetings...</p>}
          {status !== "loading" && meetings.length === 0 && (
            <p className="text-muted">No meetings yet. Create or join one to get started.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meetings.map((m) => (
              <div
                key={m._id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: 14, borderRadius: 10, background: "rgba(255,255,255,0.03)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{m.title}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    ID: {m.roomId} · Host: {m.host?.name || "Unknown"} · {new Date(m.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button className="btn-secondary" onClick={() => navigate(`/meeting/${m.roomId}`)}>
                  Rejoin
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
