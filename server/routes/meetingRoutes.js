const express = require("express");
const router = express.Router();
const { createMeeting, getMeetings, getMeeting } = require("../controllers/meetingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createMeeting);
router.get("/", protect, getMeetings);
router.get("/:roomId", protect, getMeeting);

module.exports = router;
