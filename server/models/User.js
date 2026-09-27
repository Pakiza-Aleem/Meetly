const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
    profileImage: { type: String, default: "" },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
