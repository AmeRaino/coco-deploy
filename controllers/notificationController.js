import {
    createOneNotification,
    getOneNotification,
    getOneNotificationIncludeUserDetail,
    getCountNotifications,
    getAllNotificationSendUsers,
    updateOneNotificationIsSent,
    updateOneSentNowNotification,
    updateOneScheduledNotification,
    createOneNotificationWithTime,
    deleteOneNotificationByID,
    getNotificationsOptionsTitleIsSent,
    getNotificationsOptionsTitle,
    getNotificationsOptionsUserIdIsSent,
    getNotificationsOptionsUserId,
    getNotificationsOptionsIsSent,
    getNotificationsNoOptions,
    getNotificationsOptionTitleUserID,
    getNotificationsOptionsTitleUserIDIsSent
} from '../dao/notification.dao';
import { findOneUser } from '../dao/user.dao';
import {
    createUserNotificationRelationship,
    deteleAllUserNotificationRelationship,
    getNotificationIDFromUsersID,
    getTypeNotificationIDFromUsersID,
    getUsersIDFromNotificationID
} from '../dao/user_notification.dao';
import { sendNotificationToFcm } from '../lib/firebase_fcm';
import { getTranslate } from '../utils/translate';
import { errorCode } from '../utils/util.helper';
import { ReE, ReS } from '../utils/util.service';
import { scheduleSendNotification } from '../lib/schedule';
import schedule from 'node-schedule';
import { createOneUserMobileNotification } from '../dao/user_mobile_notification.dao';
import moment from 'moment';

export const getNotification = async (req, res, next) => {
    const id = req.params.id;
    const language = req.query.language;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const notification = await getOneNotificationIncludeUserDetail(id);
        if (!notification) return ReE(res, getTranslate('Notification Do Not Exist', language), 404, errorCode.DataNull);
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
    // const hourStart = req.query?.hourStart * 1;
    // const minuteStart = req.query?.minuteStart * 1;

    // Time end
    const yearEnd = req.query?.yearEnd * 1;
    const monthEnd = req.query?.monthEnd * 1 - 1;
    const dateEnd = req.query?.dateEnd * 1;
    // const hourEnd = req.query?.hourEnd * 1;
    // const minuteEnd = req.query?.minuteEnd * 1;

    const language = req.query.language;

    if (!page || !limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    if (is_schedule) {
        if (
            !req.query.yearStart ||
            !req.query.monthStart ||
            !req.query.dateStart ||
            // !req.query.hourStart ||
            // !req.query.minuteStart ||
            !req.query.yearEnd ||
            !req.query.monthEnd ||
            !req.query.dateEnd
            // !req.query.hourEnd ||
            // !req.query.minuteEnd
        )
            return ReE(res, getTranslate('Missing Schedule Time For Notification', language), 400, errorCode.DataNull);

        const startTime = moment({ y: yearStart, m: monthStart, d: dateStart });
        const endTime = moment({ y: yearEnd, m: monthEnd, d: dateEnd });
        if (endTime.isBefore(startTime)) return ReE(res, getTranslate('The End Time Must Be Behind The Start Time', language), 403, errorCode.CanNot);
    }

    try {
        const notificationsPageNumber = await getCountNotificationsPageNumber(limit);

        if (page > notificationsPageNumber) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

        let result = [];
        let startDate, endDate;
        if (is_schedule) {
            startDate = moment({ y: yearStart, m: monthStart, d: dateStart });
            endDate = moment({ y: yearEnd, m: monthEnd, d: dateEnd });
        }
        if (title) {
            if (user_id) {
                if (is_sent) {
                    if (is_schedule) {
                        // title: yes, user_id: yes, is_sent: yes, schedule time: yes
                        const notifications = await getNotificationsOptionsTitleUserIDIsSent(title, user_id, is_sent, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: yes, user_id: yes, is_sent: yes, schedule time: no
                        result = await getNotificationsOptionsTitleUserIDIsSent(title, user_id, is_sent, page - 1, limit);
                    }
                } else {
                    if (is_schedule) {
                        // title: yes, user_id: yes, is_sent: no, schedule time: yes
                        const notifications = await getNotificationsOptionTitleUserID(title, user_id, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: yes, user_id: yes, is_sent: no, schedule time: no
                        result = await getNotificationsOptionTitleUserID(title, user_id, page - 1, limit);
                    }
                }
            } else {
                if (is_sent) {
                    if (is_schedule) {
                        // title: yes, user_id: no, is_sent: yes, schedule time: yes
                        const notifications = await getNotificationsOptionsTitleIsSent(title, is_sent, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: yes, user_id: no, is_sent: yes, schedule time: no
                        console.log('1');

                        result = await getNotificationsOptionsTitleIsSent(title, is_sent, page - 1, limit);
                    }
                } else {
                    if (is_schedule) {
                        // title: yes, user_id: no, is_sent: no, schedule time: yes
                        const notifications = await getNotificationsOptionsTitle(title, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: yes, user_id: no, is_sent: no, schedule time: no
                        result = await getNotificationsOptionsTitle(title, page - 1, limit);
                    }
                }
            }
        } else {
            if (user_id) {
                if (is_sent) {
                    if (is_schedule) {
                        // title: no, user_id: yes, is_sent: yes, schedule time: yes
                        const notifications = await getNotificationsOptionsUserIdIsSent(user_id, is_sent, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: no, user_id: yes, is_sent: yes, schedule time: no
                        result = await getNotificationsOptionsUserIdIsSent(user_id, is_sent, page - 1, limit);
                    }
                } else {
                    if (is_schedule) {
                        // title: no, user_id: yes, is_sent: no, schedule time: yes
                        const notifications = await getNotificationsOptionsUserId(user_id, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        result = await getNotificationsOptionsUserId(user_id, page - 1, limit);
                    }
                }
            } else {
                if (is_sent) {
                    if (is_schedule) {
                        // title: no, user_id: no, is_sent: yes, schedule time: yes
                        const notifications = await getNotificationsOptionsIsSent(is_sent, page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: no, user_id: no, is_sent: yes, schedule time: no
                        result = await getNotificationsOptionsIsSent(is_sent, page - 1, limit);
                    }
                } else {
                    if (is_schedule) {
                        // title: no, user_id: no, is_sent: no, schedule time: yes
                        const notifications = await getNotificationsNoOptions(page - 1, limit);
                        for (const noti of notifications) {
                            const notiDate = moment({ y: noti.year, m: noti.month, d: noti.date });
                            if (notiDate.isBetween(startDate, endDate)) result.push(noti);
                        }
                    } else {
                        // title: no, user_id: no, is_sent: no, schedule time: no
                        result = await getNotificationsNoOptions(page - 1, limit);
                    }
                }
            }
        }

        return ReS(res, { notifications: result }, 200);
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
        if (notification.dataValues.is_schedule) {
            schedule.scheduledJobs[`${notification.dataValues.id}`].cancel();
        }
        await deleteOneNotificationByID(id);
        return ReS(res, { message: `Successfully delete notification with id: ${id}` }, 200);
    } catch (error) {
        next(error);
    }
};

const getCountNotificationsPageNumber = async (limit) => {
    const countedNotifications = await getCountNotifications();
    const notificationsPageNumber = Math.ceil(countedNotifications / limit);
    return notificationsPageNumber;
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
        const data = await getTypeNotificationIDFromUsersID(user_id, 'CONNECTION');
        // const result = [];
        // data.forEach(element => {
        //     console.log(element.dataValues.notification.dataValues);
        //     if(element.dataValues.notification.dataValues.type_of_noti === 'Connection'){
        //         // console.log('hiiii');
        //         result.push(element);
        //     }
        // });

        // const result = data.filter((element) => {
        //     return element.dataValues.notification.dataValues.type_of_noti === 'Connection';
        // }, []);

        return ReS(res, { data: data }, 200);
    } catch (error) {
        next(error);
    }
};

export const getAdminNotificationsOfUser = async (req, res, next) => {
    const user_id = req.params.user_id;
    // const { language } = req.user;

    if (!user_id) return ReE(res, 'Missing Data Field', 400, errorCode.DataNull);
    try {
        const data = await getTypeNotificationIDFromUsersID(user_id, 'Admin');

        // const result = data.filter((element) => {
        //     return element.dataValues.notification.dataValues.type_of_noti === 'Admin';
        // }, []);

        return ReS(res, { data: data }, 200);
    } catch (error) {
        next(error);
    }
};

export const getLearningNotificationsOfUser = async (req, res, next) => {
    const user_id = req.params.user_id;
    // const { language } = req.user;
    
    if(!user_id) return ReE(res, 'Missing Data Field', 400, errorCode.DataNull);
    try {
        const data = await getTypeNotificationIDFromUsersID(user_id, 'Learning');
        // const result = data.filter((element) => {
        //     return element.dataValues.notification.dataValues.type_of_noti === 'Learning';
        // }, []);

        return ReS(res, { data: data }, 200);
    } catch (error) {
        next(error);
    }
};

export const getAllNotificationsOfUser = async (req, res, next) => {
    const user_id = req.params.user_id;
    // const { language } = req.user;
    
    if(!user_id) return ReE(res, 'Missing Data Field', 400, errorCode.DataNull);
    try {
        // const data = await getNotificationIDFromUsersID(user_id);
        const connection = await getTypeNotificationIDFromUsersID(user_id, 'CONNECTION');
        const learning = await getTypeNotificationIDFromUsersID(user_id, 'Learning');
        const admin = await getTypeNotificationIDFromUsersID(user_id, 'Admin');
        // const result = data.filter((element) => {
        //     return element.dataValues.notification.dataValues.type_of_noti !== 'Connection';
        // }, []);

        return ReS(res, { data: {connection, learning, admin} }, 200);
    } catch (error) {
        next(error);
    }
};
