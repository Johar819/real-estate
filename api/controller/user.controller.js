import { errorHandler } from "../utils/error";
import { findByIdAndUpdate, findByIdAndDelete, findById } from "../models/user.model";
import { hashSync } from "bcryptjs";
import { find } from "../models/list.model";
export function test(req, res) {
  res.json({
    message: "API route is working",
  });
}

export async function updateUser(req, res, next) {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(403, "You can update only your account"));
    if (req.body.password) {
      req.body.password = hashSync(req.body.password, 10);
    }
    const updatedUser = await findByIdAndUpdate(
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
}


//delete User controller 
export async function deleteUser(req, res, next) {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(403, "You can delete only your account"));
    await findByIdAndDelete(req.params.id);
    res.status(200).clearCookie("access_token").json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
}

//get lists
export async function getUserLists(req, res, next) {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can get only your own Listings!"));

    const lists = await find({userRef: req.params.id});
    res.status(200).json({
      success: true,
      lists,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
}

export async function getUser(req, res, next) {
  try{
    const user = await findById(req.params.id);
    if(!user) return next(errorHandler(404, "User not found"));
    const {password, ...rest} = user._doc;
    return res.status(200).json({success: true, rest});
  }catch(error){
    return next(errorHandler(500, error.message));
  }
}