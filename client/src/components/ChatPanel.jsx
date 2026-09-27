import { useEffect, useState, useRef } from "react";
import { socket } from "../services/socket";

export default function ChatPanel({ roomId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on("receive-message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("receive-message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit("send-message", { roomId, sender: currentUser.name, message: text.trim() });
    setText("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && <p className="text-muted" style={{ fontSize: 13 }}>No messages yet. Say hello 👋</p>}
        {messages.map((m, i) => {
          const isMine = m.sender === currentUser.name;
          return (
            <div
              key={i}
              style={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                background: isMine ? "var(--emerald-dark)" : "rgba(255,255,255,0.06)",
                padding: "8px 12px", borderRadius: 10, maxWidth: "85%",
              }}
            >
              {!isMine && <div style={{ fontSize: 11, opacity: 0.7 }}>{m.sender}</div>}
              <div style={{ fontSize: 14 }}>{m.message}</div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 2 }}>
                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, padding: 12 }}>
        <input
          style={{ flex: 1 }}
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn-primary" type="submit">Send</button>
      </form>
    </div>
  );
}
