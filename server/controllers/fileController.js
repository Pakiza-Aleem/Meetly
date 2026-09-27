const File = require("../models/File");
const path = require("path");
const fs = require("fs");

// POST /api/files/upload
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const { meetingId } = req.body;
    if (!meetingId) return res.status(400).json({ message: "meetingId is required" });

    const file = await File.create({
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user._id,
      meetingId,
    });

    res.status(201).json(file);
  } catch (error) {
    next(error);
  }
};

// GET /api/files/:meetingId
const getFilesForMeeting = async (req, res, next) => {
  try {
    const files = await File.find({ meetingId: req.params.meetingId })
      .populate("uploadedBy", "name username")
      .sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadFile, getFilesForMeeting };
