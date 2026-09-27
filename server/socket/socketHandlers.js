/**
 * All Socket.io event handling lives here, kept separate from Express routes.
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * Socket.io never carries video/audio media. It only carries small JSON
 * messages: WebRTC signaling data (offers/answers/ICE candidates), chat
 * messages, whiteboard strokes, and participant status. The actual audio
 * and video travel directly between browsers over WebRTC.
 */

// roomId -> Map(socket.id -> { userId, name })
const roomParticipants = new Map();

const socketHandlers = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ---------- MEETING / PRESENCE EVENTS ----------
    socket.on("join-room", ({ roomId, userId, name }) => {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      socket.data.name = name;

      if (!roomParticipants.has(roomId)) roomParticipants.set(roomId, new Map());
      const participants = roomParticipants.get(roomId);

      // Tell the new participant who is already in the room
      const existing = Array.from(participants.entries()).map(([socketId, info]) => ({
        socketId,
        ...info,
      }));
      socket.emit("existing-participants", existing);

      participants.set(socket.id, { userId, name, micOn: true, cameraOn: true });

      // Tell everyone else that a new participant joined
      socket.to(roomId).emit("user-joined", { socketId: socket.id, userId, name });
    });

    socket.on("leave-room", () => {
      handleDisconnect(socket);
    });

    socket.on("disconnect", () => {
      handleDisconnect(socket);
    });

    function handleDisconnect(socket) {
      const { roomId } = socket.data;
      if (!roomId) return;

      const participants = roomParticipants.get(roomId);
      if (participants) {
        participants.delete(socket.id);
        if (participants.size === 0) roomParticipants.delete(roomId);
      }

      socket.to(roomId).emit("user-left", { socketId: socket.id });
      socket.leave(roomId);
    }

    // ---------- WEBRTC SIGNALING (relayed, never inspected/modified) ----------
    socket.on("offer", ({ to, offer }) => {
      io.to(to).emit("offer", { from: socket.id, offer });
    });

    socket.on("answer", ({ to, answer }) => {
      io.to(to).emit("answer", { from: socket.id, answer });
    });

    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", { from: socket.id, candidate });
    });

    // ---------- MEDIA STATUS ----------
    socket.on("camera-toggle", ({ roomId, cameraOn }) => {
      const participants = roomParticipants.get(roomId);
      if (participants?.has(socket.id)) participants.get(socket.id).cameraOn = cameraOn;
      socket.to(roomId).emit("camera-toggle", { socketId: socket.id, cameraOn });
    });

    socket.on("mic-toggle", ({ roomId, micOn }) => {
      const participants = roomParticipants.get(roomId);
      if (participants?.has(socket.id)) participants.get(socket.id).micOn = micOn;
      socket.to(roomId).emit("mic-toggle", { socketId: socket.id, micOn });
    });

    socket.on("screen-share-start", ({ roomId }) => {
      socket.to(roomId).emit("screen-share-start", { socketId: socket.id });
    });

    socket.on("screen-share-stop", ({ roomId }) => {
      socket.to(roomId).emit("screen-share-stop", { socketId: socket.id });
    });

    // ---------- CHAT ----------
    socket.on("send-message", ({ roomId, sender, message }) => {
      const payload = { sender, message, timestamp: new Date().toISOString(), roomId };
      io.to(roomId).emit("receive-message", payload);
    });

    // ---------- WHITEBOARD ----------
    // Only small stroke descriptions are sent, never the full canvas image.
    socket.on("whiteboard-draw", ({ roomId, stroke }) => {
      socket.to(roomId).emit("whiteboard-draw", stroke);
    });

    socket.on("whiteboard-clear", ({ roomId }) => {
      socket.to(roomId).emit("whiteboard-clear");
    });
  });
};

module.exports = socketHandlers;
