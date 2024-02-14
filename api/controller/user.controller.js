const { errorHandler } = require("../utils/error");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
exports.test = (req, res) => {
  res.json({
    message: "API route is working",
  });
};

exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(403, "You can update only your account"));
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.img,
        },
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: others
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
