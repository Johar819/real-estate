//authentication controller
import User, { findOne } from "../models/user.model.js";
import { hashSync, compareSync } from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export async function signup(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(errorHandler(400, "Please add all fields"));
  }
  const hashedPassword = hashSync(password, 10);
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
}

export async function signin(req, res, next) {
  const { email, password } = req.body;
  try {
    const validUser = await findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Incorrect Password"));
    }
    const { password: pass, ...others } = validUser._doc;
    const token = sign(
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
}

export async function google(req, res, next) {
  const { email } = req.body;
  try {
    const user = await findOne({ email });
    if (user) {
      const { password: pass, ...others } = user._doc;
      const token = sign(
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
      const hashedPassword = hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: req.body.avatar,
      });
      await newUser.save();
      const jwtToken = sign(
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
}

//sign out
export function signout(req, res,next) {
  try {
    return res.status(200).clearCookie("access_token").json({
      message: "User logged out successfully",
      success: true
    })
  } catch (error) {
    next(error)
    
  }
}