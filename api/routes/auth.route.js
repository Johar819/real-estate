import { Router } from "express";
import { signup, signin, google, signout } from "../controller/auth.controller.js";
const router = Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
export default router;
