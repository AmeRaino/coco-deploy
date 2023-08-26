import {
    getOneNotification,
    getOneNotificationIncludeUserDetail,
    getAllNotificationSendUsers,
    updateOneSentNowNotification,
    updateOneScheduledNotification,
    createOneNotificationWithTime,
    deleteOneNotificationByID,
    createOneImmediateNotification,
    countNotifications,
    getNotificationsFilterPageLimitArrangement
} from '../../dao/notification.dao';
import { findOneUser, getAllUsersByRoleInCludeUserToken } from '../../dao/user.dao';
import {
    createUserNotificationRelationship,
    deteleAllUserNotificationRelationship,
    getNotificationIDFromUsersID,
    getUsersIDFromNotificationID
} from '../../dao/user_notification.dao';
import { sendNotificationToFcm } from '../../lib/firebase_fcm';
import { getTranslate } from '../../utils/translate';
import { errorCode } from '../../utils/util.helper';
import { ReE, ReS } from '../../utils/util.service';
import { scheduleSendNotification } from '../../lib/schedule';
import schedule from 'node-schedule';
import { createOneUserMobileNotification } from '../../dao/user_mobile_notification.dao';
import moment from 'moment';
import { getAllNewMentorRegistration } from '../../dao/mentor_registration.dao';
import { Op } from 'sequelize';

const MAX_HOUR_OF_DAY = 23;
const MAX_MINUTE_OF_HOUR = 59;

export const createNotification = async (req, res, next) => {
    const is_schedule = req.query.is_schedule === 'true' ? true : false;
    const { title, description, content, users } = req.body;
    const year = req.query?.year * 1;
    const month = req.query?.month * 1 - 1;
    const date = req.query?.date * 1;
    const hour = req.query?.hour * 1;
    const minute = req.query?.minute * 1;

    const { language, id } = req.user;

    if (!title) return ReE(res, getTranslate('Missing Title For Notification', language), 400, errorCode.DataNull);
    if (title.length > 100) return ReE(res, getTranslate('Title Over Limit', language), 403, errorCode.Forbidden);

    if (!description) return ReE(res, getTranslate('Missing Description For Notification', language), 400, errorCode.DataNull);
    if (description.length > 1000) return ReE(res, getTranslate('Description Over Limit', language), 403, errorCode.Forbidden);

    if (!content) return ReE(res, getTranslate('Missing Content For Notification', language), 400, errorCode.DataNull);

    if (!req.query.is_schedule) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    if (users.length === 0) return ReE(res, getTranslate('User List Can Not Be Empty', language), 400, errorCode.DataNull);

    try {
        if (is_schedule) {
            if (!req.query.year || !req.query.month || !req.query.date || !req.query.hour || !req.query.minute)
                return ReE(res, getTranslate('Missing Schedule Time For Notification', language), 400, errorCode.DataNull);
            const notification = await createOneNotificationWithTime(
                title,
                description,
                content,
                id,
                true,
                new Date(year, month, date, hour, minute),
                'Admin'
            );
            // Create relationship between user and notification for user_notification table
            for (const user of users) {
                await createUserNotificationRelationship(notification.dataValues.id, user);
                await createOneUserMobileNotification(notification.dataValues.id, user);
            }
            await scheduleSendNotification(notification, users);
        } else {
            const notification = await createOneImmediateNotification(title, description, content, id, 'Admin');
            for (const user of users) {
                await createUserNotificationRelationship(notification.dataValues.id, user);
                await createOneUserMobileNotification(notification.dataValues.id, user);
            }
            await sendNotificationToFcm(notification, users);
        }

        return ReS(res, { message: getTranslate('Tạo thành công thông báo', language) }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateNotification = async (req, res, next) => {
    const id = req.query.id;
    const { title, description, content } = req.body;
    const usersID = req.body?.usersID ?? [];
    const { language } = req.user;
    const sent_now = req.query?.sent_now === 'true' ? true : false;
    const is_schedule = req.query?.is_schedule === 'true' ? true : false;
    const year = req.query?.year * 1;
    const month = req.query?.month * 1 - 1;
    const date = req.query?.date * 1;
    const hour = req.query?.hour * 1;
    const minute = req.query?.minute * 1;

    if (sent_now) {
        if (!id || !title || !description || !content) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    } else {
        if (!id || !title || !description || !content) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
        if (is_schedule && (!year || !req.query.month || !date || !hour || !minute))
            if (is_schedule && (!year || !req.query.month * 1 || !date || !hour || !minute))
                return ReE(res, getTranslate('Missing Schedule Date Values', language), 403, errorCode.CanNot);
    }

    try {
        const notification = await getOneNotification(id);
        if (notification) {
            if (!notification.is_sent) {
                if (sent_now) {
                    // Cancel the schedule job
                    const job = schedule.scheduledJobs[`${notification.id}`];
                    job.cancel();
                    // Delete old relationshop and create new ones
                    if (usersID.length !== 0) {
                        await deteleAllUserNotificationRelationship(id);
                        for (const user of usersID) {
                            await createUserNotificationRelationship(id, user);
                        }
                    }
                    // Update content for notification
                    await updateOneSentNowNotification(id, title, description, content);
                    // Get user list of notification need to be send.
                    const users = await getUsersIDFromNotificationID(notification.id);
                    const userIdList = [];
                    for (const user of users) {
                        userIdList.push(user.user_id);
                    }
                    // Send notification
                    const noti = await getOneNotification(id);
                    await sendNotificationToFcm(noti.dataValues, userIdList);
                } else {
                    // Cancel scheudle job
                    if (is_schedule) {
                        const job = schedule.scheduledJobs[`${notification.id}`];
                        job.cancel();

                        // Update content for notification
                        await updateOneScheduledNotification(id, title, description, content, new Date(year, month, date, hour, minute));
                    }
                    // Delete old relationshop and create new ones
                    if (usersID.length !== 0) {
                        await deteleAllUserNotificationRelationship(id);
                        for (const user of usersID) {
                            await createUserNotificationRelationship(id, user);
                        }
                    }
                    // Scheudle notification
                    const noti = await getOneNotification(id);
                    await scheduleSendNotification(noti, usersID);
                }

                return ReS(res, { message: `Update successfully notification with id: ${id}` }, 200);
            } else return ReE(res, getTranslate('Can Not Update Sent Notification', language), 403, errorCode.CanNot);
        } else {
            return ReE(res, getTranslate('Notification Do Not Exist', language), 400, errorCode.DataNull);
        }
    } catch (error) {
        next(error);
    }
};

export const getNotification = async (req, res, next) => {
    const id = req.params.id;
    const language = req.query.language;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const notification = await getOneNotificationIncludeUserDetail(id);
        if (!notification && notification.type_of_noti === 'Admin')
            return ReE(res, getTranslate('Notification Do Not Exist', language), 404, errorCode.DataNull);
        return ReS(res, { notification: notification }, 200);
    } catch (error) {
        next(error);
    }
};

export const getNotifications = async (req, res, next) => {
    const title = req.query?.title;
    const limit = req.query.limit * 1;
    const page = req.query.page * 1;

    const user_id = req.query?.user_id * 1;

    const is_sent = req.query?.is_sent === 'true' ? true : false;
    const is_schedule = req.query?.is_schedule === 'true' ? true : false;

    // Time start
    const yearStart = req.query?.yearStart * 1;
    const monthStart = req.query?.monthStart * 1 - 1;
    const dateStart = req.query?.dateStart * 1;
    const hourStart = 0;
    const minuteStart = 0;

    // Time end
    const yearEnd = req.query?.yearEnd * 1;
    const monthEnd = req.query?.monthEnd * 1 - 1;
    const dateEnd = req.query?.dateEnd * 1;
    const hourEnd = MAX_HOUR_OF_DAY;
    const minuteEnd = MAX_MINUTE_OF_HOUR;

    const { language } = req.user;

    if (!page || !limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    if (req.query.is_schedule !== undefined) {
        if (!req.query.yearStart || !req.query.monthStart || !req.query.dateStart || !req.query.yearEnd || !req.query.monthEnd || !req.query.dateEnd)
            return ReE(res, getTranslate('Missing Schedule Time For Notification', language), 400, errorCode.DataNull);

        const startTime = moment({ y: yearStart, m: monthStart, d: dateStart, h: hourStart, m: minuteStart });
        const endTime = moment({ y: yearEnd, m: monthEnd, d: dateEnd, h: hourEnd, m: minuteEnd });
        if (endTime.isBefore(startTime)) return ReE(res, getTranslate('The End Time Must Be Behind The Start Time', language), 403, errorCode.CanNot);
    }

    try {
        const countedNotifications = await countNotifications('Admin');
        const notificationPages = Math.ceil(countedNotifications / limit);

        if (page > notificationPages) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

        let condition = { type_of_noti: 'Admin' };

        if (title) {
            condition = {
                ...condition,
                ...{
                    title: {
                        [Op.like]: `%${title}%`
                    }
                }
            };
        }

        if (user_id) {
            condition = { ...condition, ...{ created_user_id: user_id } };
        }

        if (req.query.is_sent !== undefined) {
            condition = { ...condition, ...{ is_sent: is_sent } };
        }

        if (is_schedule) {
            condition = {
                ...condition,
                ...{
                    sent_time: {
                        [Op.and]: {
                            [Op.gte]: new Date(yearStart, monthStart, dateStart, hourStart, minuteStart),
                            [Op.lte]: new Date(yearEnd, monthEnd, dateEnd, hourEnd, minuteEnd)
                        }
                    }
                }
            };
        }

        const notifications = await getNotificationsFilterPageLimitArrangement(condition, page - 1, limit, 'DESC');

        return ReS(res, { count: countedNotifications, pages: notificationPages, notifications: notifications }, 200);
    } catch (error) {
        next(error);
    }
};

export const getNotificationsSendUsers = async (req, res, next) => {
    const usersID = [];
    const userInforData = [];
    try {
        const users = await getAllNotificationSendUsers();
        for (const user of users) {
            usersID.push(user.created_user_id);
        }
        const filteredUsersID = filterDuplicateUsersID(usersID);
        for (const userID of filteredUsersID) {
            const data = await findOneUser(userID);
            userInforData.push({ id: data.dataValues.id, name: data.dataValues.fullname });
        }

        return ReS(res, { users: userInforData }, 200);
    } catch (error) {
        next(error);
    }
};

export const getNotificationsPageNumbers = async (req, res, next) => {
    const limit = req.params.limit * 1;
    if (!limit) limit = 20;
    const { language } = req.user;

    if (!limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    try {
        const notificationsPageNumber = await getCountNotificationsPageNumber(limit);

        return ReS(res, { pages: notificationsPageNumber }, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    const id = req.params.id * 1;
    const language = req.query.language;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const notification = await getOneNotification(id);
        if (!notification) return ReE(res, getTranslate('Notification Do Not Exist', language), 400, errorCode.DataNull);
        if (notification.is_schedule) {
            schedule.scheduledJobs[`${notifications.id}`].cancel();
        }
        await deleteOneNotificationByID(id);
        return ReS(res, { message: `Successfully delete notification with id: ${id}` }, 200);
    } catch (error) {
        next(error);
    }
};

const filterDuplicateUsersID = (users) => {
    const data = users.filter((user, index) => users.indexOf(user) === index);
    data.sort((a, b) => a - b);
    return data;
};

export const getConnectionNotificationsOfUser = async (req, res, next) => {
    const user_id = req.params.user_id;
    // const { language } = req.user;

    if (!user_id) return ReE(res, 'Missing Data Field', 400, errorCode.DataNull);
    try {
        const data = await getNotificationIDFromUsersID(user_id);
        // const result = [];
        // data.forEach(element => {
        //     console.log(element.dataValues.notification.dataValues);
        //     if(element.dataValues.notification.dataValues.type_of_noti === 'Connection'){
        //         // console.log('hiiii');
        //         result.push(element);
        //     }
        // });

        const result = data.filter((element) => {
            return element.dataValues.notification.dataValues.type_of_noti === 'Connection';
        }, []);

        return ReS(res, { data: result }, 200);
    } catch (error) {
        next(error);
    }
};

export const getOtherNotificationsOfUser = async (req, res, next) => {
    const user_id = req.params.user_id;
    // const { language } = req.user;

    if (!user_id) return ReE(res, 'Missing Data Field', 400, errorCode.DataNull);
    try {
        const data = await getNotificationIDFromUsersID(user_id);
        const result = data.filter((element) => {
            return element.dataValues.notification.dataValues.type_of_noti !== 'Connection';
        }, []);

        return ReS(res, { data: result }, 200);
    } catch (error) {
        next(error);
    }
};

export const getUsersByRole = async (req, res, next) => {
    const { language } = req.user;
    const role_id = req.query.role_id * 1;
    const page = req.query.page * 1;
    const limit = req.query.limit * 1;
    const is_all =
        req.query.is_all === 'true'
            ? true
            : req.query.is_all === 'false'
            ? false
            : ReE(res, getTranslate('Wrong Format', language), 403, errorCode.Forbidden);

    if (!role_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const users = await getAllUsersByRoleInCludeUserToken(role_id);
        const payload = users.filter((user) => user.user_device_token.length !== 0);

        if (is_all) {
            return ReS(res, { users: payload, count: payload.length }, 200);
        } else if (page && limit) {
            const pageNumber = Math.ceil(payload.length / limit);
            if (page > pageNumber) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);
            const data = payload.slice((page - 1) * limit, (page - 1) * limit + limit - 1);
            return ReS(res, { users: data }, 200);
        } else return ReE(res, getTranslate('Can Not Perform This Action', language), 403, errorCode.Forbidden);
    } catch (error) {
        next(error);
    }
};

export const getUsersByMentorRegistration = async (req, res, next) => {
    const { language } = req.user;

    try {
        const registrations = await getAllNewMentorRegistration();
        const payload = registrations.filter((item) => item.create_by_user.user_device_token.length !== 0);
        return ReS(res, { users: payload }, 200);
    } catch (error) {
        next(error);
    }
};
