const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    title: { type: String, default: "Untitled Meeting" },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    endedAt: { type: Date, default: null },
  },
  { timestamps: true } // createdAt acts as the "date" shown on the dashboard
);

module.exports = mongoose.model("Meeting", meetingSchema);
