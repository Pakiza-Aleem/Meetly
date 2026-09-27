const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Store files on local disk during development (see README for production notes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Basic allow-list to block dangerous executable uploads
const allowedTypes = [
  ".png", ".jpg", ".jpeg", ".gif", ".webp",
  ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
  ".txt", ".zip", ".csv",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
});

module.exports = upload;
