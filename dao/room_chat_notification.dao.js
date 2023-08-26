import { RoomChatNotification, RoomChatMember, RoomChat } from '../models';
import { and, Op, Sequelize } from 'sequelize';

module.exports = {
    getAllChatNotificationByCurrentUser,
    getListRoomChatNotificationFromListRoomChatMemberId
};

async function getAllChatNotificationByCurrentUser(arrChatRoomMemberId) {
    try {
        const { count, rows } = await RoomChatNotification.findAndCountAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: arrChatRoomMemberId
                },
                isSeen: false
            },
            include: {
                model: RoomChatMember,
                attributes: ['id'],
                include: {
                    model: RoomChat,
                    attributes: ['id']
                }
            },
            raw: true
        });

        return { count, rows };
    } catch (error) {
        return null;
    }
}

async function getListRoomChatNotificationFromListRoomChatMemberId(rawListMemberId) {
    try {
        const listNotificationOfListMemberId = await RoomChatNotification.findAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: rawListMemberId
                }
            }
        });

        return listNotificationOfListMemberId;
    } catch (error) {
        throw new Error(`${error}, traceback getListRoomChatNotificationFollowListRoomChatMemberId()`);
    }
}
