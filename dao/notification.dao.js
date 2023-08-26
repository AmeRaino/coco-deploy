import { Op } from 'sequelize';
import { Notification, User, Role, UserDeviceToken } from '../models';

export const createOneNotificationWithTime = async (title, description, content, user_id, is_schedule, date, type) => {
    try {
        const notification = await Notification.create({
            title: title,
            description: description,
            content: content,
            created_user_id: user_id,
            is_schedule: is_schedule,
            sent_time: date,
            type_of_noti: type
        });
        return notification;
    } catch (error) {
        throw new Error(`${error}, traceback createOneNotificationWithTime function at notification.dao.js in dao folder`);
    }
};

export const createOneImmediateNotification = async (title, description, content, user_id, type) => {
    try {
        const notification = await Notification.create({
            title: title,
            description: description,
            content: content,
            created_user_id: user_id,
            type_of_noti: type,
            is_sent: true
        });
        return notification;
    } catch (error) {
        throw new Error(`${error}, traceback createOneImmediateNotification function at notification.dao.js in dao folder`);
    }
};

export const getOneNotificationIncludeUserDetail = async (notification_id) => {
    try {
        const notification = await Notification.findOne({
            where: { 
                id: notification_id,
                is_deleted: false
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'username'],
                include: {
                    model: Role,
                    as: 'role',
                    attributes: ['id']
                },
                through: { attributes: [] }
            }
        });
        return notification;
    } catch (error) {
        throw new Error(`${error}, traceback getOneNotification function at notification.dao.js in dao folder`);
    }
};

export const getOneNotification = async (notification_id) => {
    try {
        return await Notification.findOne({
            where: { 
                id: notification_id,
                is_deleted: false
            },
            raw: true
        });
    } catch (error) {
        throw new Error(`${error}, traceback getOneNotification function at notification.dao.js in dao folder`);
    }
};

export const countNotifications = async (type) => {
    try {
        const data = await Notification.findAndCountAll({
            where: {
                type_of_noti: type,
                is_deleted: false
            }
        });
        return data.count;
    } catch (error) {
        throw new Error(`${error}, traceback getCountNotifications function at notification.dao.js in dao folder`);
    }
};

export const getAllNotificationSendUsers = async () => {
    try {
        const users = await Notification.findAll({ attributes: ['created_user_id'] });
        return users;
    } catch (error) {
        throw new Error(`${error}, traceback getAllNotificationSendUsers function at notification.dao.js in dao folder`);
    }
};

export const updateOneNotificationIsSent = async (notification_id) => {
    try {
        await Notification.update(
            {
                is_sent: true
            },
            {
                where: { id: notification_id, is_deleted: false }
            }
        );
    } catch (error) {
        throw new Error(`${error}, traceback updateOneNotification function at notification.dao.js in dao folder`);
    }
};

export const updateOneSentNowNotification = async (notification_id, title, description, content) => {
    try {
        await Notification.update(
            {
                title: title,
                description: description,
                content: content,
                is_schedule: false,
                is_sent: true
            },
            {
                where: { id: notification_id, is_deleted: false }
            }
        );
    } catch (error) {
        throw new Error(`${error}, traceback updateOneNotification at notification.dao.js in dao folder`);
    }
};

export const updateOneScheduledNotification = async (notification_id, title, description, content, date) => {
    try {
        await Notification.update(
            {
                title: title,
                description: description,
                content: content,
                sent_time: date
            },
            {
                where: { id: notification_id, is_deleted: false }
            }
        );
    } catch (error) {
        throw new Error(`${error}, traceback updateOneNotification at notification.dao.js in dao folder`);
    }
};

export const getAllNotifications = async () => {
    try {
        const data = await Notification.findAll();
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback getAllNotifications at notification.dao.js in dao folder`);
    }
};

export const deleteOneNotificationByID = async (notification_id) => {
    try {
        await Notification.destroy({
            where: {
                id: notification_id
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback deleteOneNotificationByID at notification.dao.js in dao folder`);
    }
};

export const getNotificationsFilterPageLimitArrangement = async (condition, page, limit, arrangement) => {
    try {
        return Notification.findAll({
            where: condition,
            offset: page * limit,
            limit: limit,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', arrangement]]
        });
    } catch (error) {
        throw new Error(`${error}, traceback getNotificationsFilterPageLimitArrangement at notification.dao.js in dao folder`);
    }
};
