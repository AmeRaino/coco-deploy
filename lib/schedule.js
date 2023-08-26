import schedule from 'node-schedule';
import { getAllNotifications, updateOneNotificationIsSent } from '../dao/notification.dao';
import { getUsersIDFromNotificationID } from '../dao/user_notification.dao';
import { sendNotificationToFcm } from './firebase_fcm';

export const scheduleSendNotification = async (notification, users) => {
    try {
        const rule = createRule(notification);
        const job = schedule.scheduleJob(`${notification.id}`, rule, async () => {
            await updateOneNotificationIsSent(notification.id);
            await sendNotificationToFcm(notification, users);
        });
    } catch (error) {
        throw new Error(`${error}, traceback scheduleSendNotification function at schedule.js`);
    }
};

export const reScheduleJobsAfterRestartServer = async () => {
    try {
        const notifications = await getAllNotifications();
        for (const noti of notifications) {
            if (!noti.dataValues.is_sent && noti.dataValues.is_schedule) {
                const users = await getUsersIDFromNotificationID(noti.dataValues.id);
                await scheduleSendNotification(noti.dataValues, users);
            }
        }
    } catch (error) {
        throw new Error(`${error}, traceback reScheduleJobsAfterRestart function at schedule.js`);
    }
};

export const createRule = (notification) => {
    const rule = new schedule.RecurrenceRule();
    const date = new Date(notification.sent_time);
    rule.year = date.getFullYear();
    rule.month = date.getMonth();
    rule.date = date.getDate();
    rule.hour = date.getHours();
    rule.minute = date.getMinutes();
    rule.second = 0;
    rule.tz = 'Asia/Jakarta';

    return rule;
};
