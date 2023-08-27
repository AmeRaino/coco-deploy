import { UserMobileNotification } from '../models';

export const createOneUserMobileNotification = async (notification_id, user_id) => {
    try {
        await UserMobileNotification.create({
            user_id: user_id,
            notification_id: notification_id
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback createOneUserMobileNotification function at user_mobile_notification.dao.js file`);
    }
};
