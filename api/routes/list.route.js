const express = require("express");
const Router = express.Router();
const { createList } = require("../controller/list.controller");
const { verifyUser } = require("../utils/verifyUser");
Router.post("/create",verifyUser,createList);
module.exports = Router