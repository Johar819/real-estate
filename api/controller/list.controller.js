const mongoose = require("mongoose");
const List = require("../models/list.model");
exports.createList = async (req, res, next) => {
    try {
        const list = await List.create(req.body);
        return res.status(200).json({success:true,list});
    } catch (error) {
        next(error);
    }
}

//delete listing
exports.deleteList = async (req, res, next) => {
    try {
        const userList = await List.findById(req.params.id);
        if(!userList) return next(errorHandler(404,"List not found"));
        if(userList.userRef.toString() !== req.user.id) return next(errorHandler(403,"You can delete only your list"));
        await List.findByIdAndDelete(req.params.id);
        return res.status(200).json({success:true,message:"List deleted successfully"});
    } catch (error) {
        next(error);
    }
}