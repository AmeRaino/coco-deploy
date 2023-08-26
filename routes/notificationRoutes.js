import express from 'express';
const router = express.Router();

import { protect } from '../controllers/authController';
import {
    getConnectionNotificationsOfUser,
    getNotifications,
    getNotification,
    deleteNotification,
    getAllNotificationsOfUser,
    getLearningNotificationsOfUser,
    getAdminNotificationsOfUser
} from '../controllers/notificationController';

router.use(protect);

router.get('/get-all-notifications/:user_id', getAllNotificationsOfUser);

router.get('/get-connection-notifications/:user_id', getConnectionNotificationsOfUser);

router.get('/get-learning-notifications/:user_id', getLearningNotificationsOfUser);

router.get('/get-admin-notifications/:user_id', getAdminNotificationsOfUser);

router.get('/get/notifications', getNotifications);

router.get('/get/notification/:id', getNotification);

router.delete('/delete/notification/:id', deleteNotification);

export default router;
