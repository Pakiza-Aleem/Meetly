const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true }, // path on disk / URL to download
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true }, // bytes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    meetingId: { type: String, required: true }, // roomId of the meeting
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
