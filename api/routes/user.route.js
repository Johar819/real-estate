const express = require("express");
const router  = express.Router();
const {test, updateUser} = require("../controller/user.controller");
const { verifyUser } = require("../utils/verifyUser");
router.get('/test',test)
router.post("/update/:id",verifyUser,updateUser);
module.exports = router;