const crypto = require("crypto");
const Meeting = require("../models/Meeting");

// Generates a short, URL-friendly random room id, e.g. "a1b2c3"
const generateRoomId = () => crypto.randomBytes(4).toString("hex");

// POST /api/meetings  -> create a new meeting
const createMeeting = async (req, res, next) => {
  try {
    const { title } = req.body;
    let roomId = generateRoomId();

    // Extremely unlikely, but make sure the id is unique
    while (await Meeting.findOne({ roomId })) {
      roomId = generateRoomId();
    }

    const meeting = await Meeting.create({
      roomId,
      title: title || "Untitled Meeting",
      host: req.user._id,
      participants: [req.user._id],
    });

    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
};

// GET /api/meetings -> meetings the current user created or joined
const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user._id }, { participants: req.user._id }],
    })
      .populate("host", "name username")
      .sort({ createdAt: -1 });

    res.json(meetings);
  } catch (error) {
    next(error);
  }
};

// GET /api/meetings/:roomId -> single meeting, used when joining
const getMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findOne({ roomId: req.params.roomId }).populate(
      "host",
      "name username"
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    // Add the joining user as a participant if not already recorded
    if (!meeting.participants.includes(req.user._id)) {
      meeting.participants.push(req.user._id);
      await meeting.save();
    }

    res.json(meeting);
  } catch (error) {
    next(error);
  }
};

module.exports = { createMeeting, getMeetings, getMeeting };
