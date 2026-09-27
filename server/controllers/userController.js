const User = require("../models/User");

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.profileImage = req.body.profileImage ?? user.profileImage;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      username: updated.username,
      email: updated.email,
      profileImage: updated.profileImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, updateProfile };
