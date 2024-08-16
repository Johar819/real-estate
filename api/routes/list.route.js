import { Router as _Router } from "express";
const Router = _Router();
import { createList, deleteList, updateList, getLists, getList } from "../controller/list.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
Router.post("/create",verifyUser,createList);
Router.delete('/delete/:id',verifyUser,deleteList);
Router.post('/update/:id',verifyUser,updateList);
Router.get('/get/:id',getList);
Router.get('/get',getLists);
export default Router