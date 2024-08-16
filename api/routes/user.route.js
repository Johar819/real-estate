import { Router } from "express";
const router  = Router();
import { test, updateUser,deleteUser, getUserLists, getUser } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
router.get('/test',test)
router.post('/update/:id',verifyUser,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id',verifyUser,getUserLists);
router.get('/:id',verifyUser,getUser);
export default router;