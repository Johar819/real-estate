const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Incorrect Password"));
    }
    const { password: pass, ...others } = validUser._doc;
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        others,
      });
  } catch (err) {
    next(err);
  }
};

exports.google = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const { password: pass, ...others } = user._doc;
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET
      );
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({
          others,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: req.body.img,
      });
      await newUser.save();
      const jwtToken = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.JWT_SECRET
      );
      const { password: pass, ...others } = newUser._doc;
      res
        .cookie("access_token", jwtToken, {
          httpOnly: true,
        })
        .status(200)
        .json({
          others,
        });
    }
  } catch (error) {
    next(error);
  }
};
