import { Router as _Router } from "express";
const Router = _Router();
import { createList, deleteList, updateList, getLists, getList } from "../controller/list.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
Router.post("/create",verifyToken,createList);
Router.delete('/delete/:id',verifyToken,deleteList);
Router.post('/update/:id',verifyToken,updateList);
Router.get('/get/:id',getList);
Router.get('/get',getLists);
export default Router