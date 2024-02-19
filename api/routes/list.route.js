const express = require("express");
const Router = express.Router();
const { createList, deleteList } = require("../controller/list.controller");
const { verifyUser } = require("../utils/verifyUser");
Router.post("/create",verifyUser,createList);
Router.delete('/delete/:id',verifyUser,deleteList)
module.exports = Router