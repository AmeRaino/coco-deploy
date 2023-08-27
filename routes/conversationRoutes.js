const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.get('/users/:userId', conversationController.getAll);

router.get('/online-users/:userId', conversationController.getOnlineUsers);

router.post('/get-conversation', conversationController.getMemberInMessageOfUser);

router.post('/join', conversationController.join);

router.post('/messages/:messageId', conversationController.markAsRead);

router.get('/:conversationId/messages', conversationController.getMessagesByConversationId);

router.delete('/:conversationId', conversationController.deleteById);

module.exports = router;
