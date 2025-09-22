import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage, migrate, deleteMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", authenticateJWT, getUsersForSidebar);
router.get("/:id", authenticateJWT, getMessages)

router.post("/send/:id", authenticateJWT, sendMessage)
router.post("/delete/:id", authenticateJWT, deleteMessage)
// router.post("/migrate", migrate)

export default router