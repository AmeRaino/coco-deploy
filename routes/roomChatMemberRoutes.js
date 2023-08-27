const express = require('express');
const router = express.Router();
import { getRoomChatLatestMessageController } from '../controllers/roomChatLatestMessageController';
const authController = require('./../controllers/authController');

router.use(authController.protect);
router.post('/get-all-lates-chat', authController.restrictToSys({ chats: 'view' }), getRoomChatLatestMessageController);

export default router;
