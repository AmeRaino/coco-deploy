import { deleteMessage } from '../controllers/roomChatMessageController';
const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');

router.use(authController.protect);
router.delete('/delete-message', authController.restrictToSys({ chats: 'delete' }), deleteMessage);
export default router;
