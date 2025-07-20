import  express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getmessages, getusersforsidebar, sendmessage } from "../controllers/message.controller.js";

const router=express.Router();

router.get("/users",protectRoute,getusersforsidebar);
router.get("/:id",protectRoute,getmessages)
router.post("/send/:id",protectRoute,sendmessage)
export default router