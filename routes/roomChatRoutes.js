import {
    createChatRoomController,
    getAllRoomChatBaseOnUserIdController,
    deleteChatRoom,
    createChatRoomForEndUserHasLogin
} from '../controllers/roomChatController';
const authController = require('./../controllers/authController');
const express = require('express');
const router = express.Router();

router.use(authController.protect);
router.post('/create-room-chat', createChatRoomController);
router.post('/get-all-room-chat', authController.restrictToSys({ chats: 'view' }), getAllRoomChatBaseOnUserIdController);
router.delete('/delete-chat-room', authController.restrictToSys({ chats: 'delete' }), deleteChatRoom);
router.post('/create-room-chat-for-end-user', createChatRoomForEndUserHasLogin);
// router.post("/join-chat-room", joinRoomChatCustomerService);

export default router;
