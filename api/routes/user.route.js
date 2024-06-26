const express = require("express");
const router  = express.Router();
const {test, updateUser, deleteUser, getUserLists, getUser} = require("../controller/user.controller");
const { verifyUser } = require("../utils/verifyUser");
router.get('/test',test)
router.post('/update/:id',verifyUser,updateUser);
router.delete('/delete/:id',verifyUser,deleteUser);
router.get('/listings/:id',verifyUser,getUserLists);
router.get('/:id',verifyUser,getUser);
module.exports = router;