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

  useEffect(() => {
    dispatch(getMeetings());
  }, [dispatch]);

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

    if (joinCode.trim()) {
      navigate(`/meeting/${joinCode.trim()}`);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <div className="container dashboard-container">

        {/* Create + Join */}
        <div className="dashboard-actions">

          {/* Create Meeting */}
          <div className="glass-panel dashboard-card">
            <h3>Create Meeting</h3>

            <p className="text-muted">
              Start an instant meeting and share the code with others.
            </p>

            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? "Creating..." : "New Meeting"}
            </button>
          </div>

          {/* Join Meeting */}
          <div className="glass-panel dashboard-card">
            <h3>Join Meeting</h3>

            <form
              onSubmit={handleJoin}
              className="join-form"
            >
              <input
                placeholder="Enter meeting code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />

              <button
                className="btn-secondary"
                type="submit"
              >
                Join Meeting
              </button>
            </form>
          </div>

        </div>

        {/* Recent Meetings */}
        <div className="glass-panel recent-meetings">

          <h3>Recent Meetings</h3>

          {status === "loading" && (
            <p className="text-muted">
              Loading meetings...
            </p>
          )}

          {status !== "loading" && meetings.length === 0 && (
            <p className="text-muted">
              No meetings yet. Create or join one to get started.
            </p>
          )}

          <div className="meeting-list">

            {meetings.map((m) => (
              <div
                key={m._id}
                className="meeting-item"
              >

                <div className="meeting-info">

                  <div className="meeting-title">
                    {m.title}
                  </div>

                  <div className="text-muted meeting-meta">
                    ID: {m.roomId} · Host:{" "}
                    {m.host?.name || "Unknown"} ·{" "}
                    {new Date(m.createdAt).toLocaleDateString()}
                  </div>

                </div>

                <button
                  className="btn-secondary rejoin-btn"
                  onClick={() =>
                    navigate(`/meeting/${m.roomId}`)
                  }
                >
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