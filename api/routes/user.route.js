import { Router } from "express";
const router  = Router();
import { test, updateUser, deleteUser, getUserLists, getUser } from "../controller/user.controller";
import { verifyUser } from "../utils/verifyUser";
router.get('/test',test)
router.post('/update/:id',verifyUser,updateUser);
router.delete('/delete/:id',verifyUser,deleteUser);
router.get('/listings/:id',verifyUser,getUserLists);
router.get('/:id',verifyUser,getUser);
export default router;