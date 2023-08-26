import express from 'express';
const router = express.Router();

import { protect } from '../../controllers/adminController/authController';
import {
    createNotification,
    deleteNotification,
    getConnectionNotificationsOfUser,
    getNotification,
    getNotifications,
    getNotificationsPageNumbers,
    getNotificationsSendUsers,
    getOtherNotificationsOfUser,
    getUsersByMentorRegistration,
    getUsersByRole,
    updateNotification
} from '../../controllers/adminController/notificationController';

router.use(protect);
// POST Routes
router.post('/create/notification', createNotification);

// GET Routes
router.get('/get/notification/:id', getNotification);
router.get('/get/notifications', getNotifications);
router.get('/get/pageNumbers/:limit', getNotificationsPageNumbers);
router.get('/get/sendUsers', getNotificationsSendUsers);

router.get('/get/users/role', getUsersByRole);
router.get('/get/users/mentor_registration', getUsersByMentorRegistration);

// PUT Routes
router.put('/update/notification', updateNotification);

// DELETE Routes
router.delete('/delete/notification/:id', deleteNotification);

module.exports = router;
