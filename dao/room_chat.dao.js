import { RoomChat, RoomChatMember } from '../models';
import { Op } from 'sequelize';
import { createChatRoomMember, getRoomChatMemberBaseOnEndUserId } from './room_chat_member.dao';

module.exports = {
    getAllRoomChatIdBaseOnUserId,
    initChatRoomForEndUserHasLogin,
    //   checkIsEndUserCreatedAChatRoom,
    createChatRoom,
    findRoomChatByPk
};

async function createChatRoom(
    userId
    // typeRoom = TypeChatRoom.NORMAL
) {
    try {
        const roomChat = await RoomChat.create({
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            // typeRoom: typeRoom,
            isDeleted: false
        });

        return roomChat;
    } catch (error) {
        throw new Error(error);
    }
}

async function checkIsEndUserCreatedAChatRoom(userId) {
    try {
        const check = await RoomChat.findOne({
            where: {
                [Op.and]: {
                    createdBy: userId,
                    //   typeRoom: TypeChatRoom.CUSTOMER_SERVICE,
                    isDeleted: false
                }
            },
            raw: true
        });

        return check;
    } catch (error) {
        return null;
    }
}

async function getAllRoomChatIdBaseOnUserId(user_id) {
    try {
        const listRoomChatId = [];
        const result = await RoomChatMember.findAll({
            where: {
                userId: user_id
            },
            include: [
                {
                    model: RoomChat,
                    where: {
                        isDeleted: false
                    }
                }
            ],
            raw: true
        }).then((res) => {
            res.forEach((element) => {
                if (element['RoomChat.id']) {
                    listRoomChatId.push(element['RoomChat.id']);
                }
            });
        });

        return listRoomChatId;
    } catch (error) {
        return null;
    }
}

async function initChatRoomForEndUserHasLogin(userId) {
    try {
        const check = await checkIsEndUserCreatedAChatRoom(userId);

        if (!check) {
            const roomChat = await createChatRoom(
                userId
                // TypeChatRoom.CUSTOMER_SERVICE
            );

            const roomChatMember = await createChatRoomMember(userId, roomChat.dataValues.id);

            return { isHadChatRoom: false, roomChatMember: roomChatMember };
        } else {
            const roomChatMember = await getRoomChatMemberBaseOnEndUserId(userId, check.id);

            return { isHadChatRoom: true, roomChatMember: roomChatMember };
        }
    } catch (error) {
        throw new Error(`${error}, traceback initChatRoomForEndUserHasLogin()`);
    }
}

async function findRoomChatByPk(id) {
    try {
        const roomChat = await RoomChat.findByPk(id);
        return roomChat;
    } catch (error) {
        throw new Error(`${error}, traceback findRoomChatByPk()`);
    }
}

// export const TypeChatRoom = Object.freeze({
//   CUSTOMER_SERVICE_NO_LOGIN: "CUSTOMER_SERVICE_NO_LOGIN",
//   CUSTOMER_SERVICE: "CUSTOMER_SERVICE",
//   NORMAL: "NORMAL",
// });
