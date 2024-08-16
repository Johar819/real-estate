import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import List from "../models/list.model.js"
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
          username: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...others } = updatedUser._doc;
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        others
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};


//delete User controller 
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(403, "You can delete only your account"));
    await User.findByIdAndDelete(req.params.id);
    res.status(200).clearCookie("access_token").json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

//get lists
exports.getUserLists = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can get only your own Listings!"));

    const lists = await List.find({userRef: req.params.id});
    res.status(200).json({
      success: true,
      lists,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

exports.getUser = async (req, res, next) => {
  try{
    const user = await User.findById(req.params.id);
    if(!user) return next(errorHandler(404, "User not found"));
    const {password, ...rest} = user._doc;
    return res.status(200).json({success: true, rest});
  }catch(error){
    return next(errorHandler(500, error.message));
  }
}