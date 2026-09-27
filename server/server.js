require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const socketHandlers = require("./socket/socketHandlers");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const fileRoutes = require("./routes/fileRoutes");

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => res.send("Meetly API is running"));

app.use(notFound);
app.use(errorHandler);

// Create one HTTP server shared by Express and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});

socketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Meetly server running on port ${PORT}`));
