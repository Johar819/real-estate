import { Router } from "express";
const router  = Router();
import { test, updateUser, getUserLists, getUser } from "../controller/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
router.get('/test',test)
router.post('/update/:id',verifyUser,updateUser);
// router.delete('/delete/:id',verifyUser,deleteUser);
router.get('/listings/:id',verifyUser,getUserLists);
router.get('/:id',verifyUser,getUser);
export default router;