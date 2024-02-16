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