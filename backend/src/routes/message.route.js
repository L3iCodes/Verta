import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users", authenticateJWT, getUsersForSidebar);
router.get("/:id", authenticateJWT, getMessages)

router.post("/send/:id", authenticateJWT, sendMessage)

export default router