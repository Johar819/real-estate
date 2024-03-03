const express = require("express");
const Router = express.Router();
const { createList, deleteList, updateList, getLists, getList } = require("../controller/list.controller");
const { verifyUser } = require("../utils/verifyUser");
Router.post("/create",verifyUser,createList);
Router.delete('/delete/:id',verifyUser,deleteList);
Router.post('/update/:id',verifyUser,updateList);
Router.get('/get/:id',getList);
Router.get('/get',getLists);
module.exports = Router