const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
import {
    seenNotification,
    checkIsHaveNotification,
    seenAllNotification,
    checkIsHaveNotificationMobile,
    countUnSeenNotification
} from '../controllers/roomChatNotificationController';

router.use(authController.protect);
router.post('/seen-chat-notification', seenNotification);
router.post('/check-notification-chat', checkIsHaveNotification);
router.post('/check-notification-chat-mobile', checkIsHaveNotificationMobile);
router.post('/count-un-seen-notification', countUnSeenNotification);
router.post('/seen-all-notification-chat', seenAllNotification);

export default router;
