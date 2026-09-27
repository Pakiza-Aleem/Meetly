const express = require("express");
const router = express.Router();
const { uploadFile, getFilesForMeeting } = require("../controllers/fileController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/upload", protect, upload.single("file"), uploadFile);
router.get("/:meetingId", protect, getFilesForMeeting);

module.exports = router;
