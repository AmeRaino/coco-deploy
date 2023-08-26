import { Op, Sequelize } from 'sequelize';
import { RoomChatMessage, RoomChatMember, RoomChatAttachment, User } from '../models';

module.exports = {
    getLatestChatMessageByChatRoomMemberId,
    createEmptyMessage,
    getAllChatMessageByRoomMemberId,
    createChatMessage,
    findMessageByPk
};

async function getLatestChatMessageByChatRoomMemberId(arrChatRoomMemberId) {
    try {
        const result = await RoomChatMessage.findAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: arrChatRoomMemberId
                }
            },
            attributes: [Sequelize.fn('max', Sequelize.col('createdAt'))],
            group: ['roomChatMemberId'],
            raw: true
        }).then(async (res) => {
            const listLatesTime = [];
            res.forEach((element) => {
                listLatesTime.push(element['max(`createdAt`)']);
            });

            const final = await RoomChatMessage.findAll({
                where: {
                    createdAt: {
                        [Op.in]: listLatesTime
                    }
                },
                raw: true
            });

            return final;
        });

        return result;
    } catch (error) {
        return null;
    }
}

async function createEmptyMessage(roomChatMemberId) {
    try {
        const createEmptyMessage = await RoomChatMessage.create({
            roomChatMemberId: roomChatMemberId,
            message: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            isEdited: false,
            isDeleted: false
        });

        return createEmptyMessage;
    } catch (error) {
        throw new Error(`${error}, traceback createEmptyMessage()`);
    }
}

async function getAllChatMessageByRoomMemberId(roomChatMemberId, limit, page) {
    try {
        const message = await RoomChatMessage.findAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: roomChatMemberId
                },
                isDeleted: false
            },
            attributes: ['id', 'roomChatMemberId', 'message', 'createdAt'],
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: RoomChatAttachment,
                    attributes: ['id', 'attachmentPath', 'extensionAttachment', 'originalNameAttachment']
                },
                {
                    model: RoomChatMember,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'avatar']
                        }
                    ]
                }
            ],
            limit: limit,
            offset: (page - 1) * limit,
            raw: true
        });

        return message;
    } catch (error) {
        throw new Error(`${error}, traceback getAllChatMessageByRoomMemberId()`);
    }
}

async function createChatMessage(roomChatMemberId, message, roomChatId) {
    try {
        const chatMessage = await RoomChatMessage.create({
            roomChatMemberId: roomChatMemberId,
            message: message,
            createdAt: new Date(),
            updatedAt: new Date(),
            isEdited: false,
            isDeleted: false,
            roomChatId: roomChatId
        });

        return chatMessage;
    } catch (error) {
        throw new Error(`${error}, traceback createChatMessage()`);
    }
}

async function findMessageByPk(id) {
    try {
        const message = await RoomChatMessage.findByPk(id);
        return message;
    } catch (error) {
        throw new Error(`${error}, traceback findMessageByPk()`);
    }
}
