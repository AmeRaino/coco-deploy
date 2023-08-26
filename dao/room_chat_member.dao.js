import { RoomChatMember, RoomChat, User, Role, RoleType } from '../models';
import { Op, Sequelize } from 'sequelize';
import { getAllUserRoleEndUser } from './user.dao';

module.exports = {
    createChatRoomMember,
    getRoomChatMemberBaseOnEndUserId,
    //   getRoomChatMemberByUserIdAndChatRoomId,
    getRoomChatMemberIdIsPartner,
    getlistRoomChatMemberIdOfCurrentUser,
    checkTheyHasDialogBefor,
    getAllRoomChatMemberIdByUserId,
    getAllRoomChatMemberNotCurrentUser,
    findOneRoomChatMemberById,
    getListRoomChatMemberByRoomChatId,
    getAllRoomChatBaseOnUserId,
    getAllRoomChatMemberByRoomChatId,
    getAllRoomChatMemberByUserId,
    getChatRoomMemberIdByRoomChatIdAndUserId
};

async function findOneRoomChatMemberById(id) {
    try {
        const roomChatMember = await RoomChatMember.findOne({
            where: {
                id: id
            }
        });

        return roomChatMember;
    } catch (error) {
        throw new Error(`${error}, traceback findOneRoomChatMemberById()`);
    }
}

async function createChatRoomMember(
    user_id,
    room_chat_id
    // memberType = TypeChatRoomMember.External
) {
    try {
        const cre = await RoomChatMember.create({
            userId: user_id,
            roomChatId: room_chat_id,
            createdAt: new Date(),
            isBlocked: false,
            // memberType: memberType,
            isDeleted: false
        });

        return cre.dataValues;
    } catch (error) {
        throw new Error(`${error}, traceback createChatRoomMember()`);
    }
}

async function getRoomChatMemberBaseOnEndUserId(userId, roomChatId) {
    try {
        const re = await RoomChatMember.findOne({
            where: {
                userId: userId,
                roomChatId: roomChatId
            },
            raw: true
        });

        return re;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getRoomChatMemberByUserIdAndChatRoomId(adminUserId, roomChatId) {
    try {
        const check = await RoomChatMember.findOne({
            where: {
                [Op.and]: {
                    roomChatId: roomChatId,
                    userId: adminUserId
                }
            }
        });

        return check;
    } catch (error) {
        throw new Error(error);
    }
}

async function getRoomChatMemberIdIsPartner(userId, isRoleContent) {
    try {
        const listRoomChatId_typeNormal = await getAllRoomChatIdTypeNormalBaseOnUserId(userId);
        const ids = [];
        const data = await RoomChatMember.findAll({
            where: {
                userId: {
                    [Op.not]: userId
                },
                roomChatId: {
                    [Op.in]: listRoomChatId_typeNormal
                }
            },
            raw: true
        }).then((res) => {
            res.forEach((element) => {
                ids.push(element.id);
            });
        });
        if (isRoleContent) {
            const listRoomChatId_typeCustomerService = await getAllRoomChatIdTypeCustomerServiceBaseOnUserId(userId);
            const query = await getAllUserRoleEndUser();
            const data1 = await RoomChatMember.findAll({
                where: {
                    userId: {
                        [Op.or]: {
                            [Op.is]: null,
                            [Op.in]: query
                        }
                    },
                    roomChatId: {
                        [Op.in]: listRoomChatId_typeCustomerService
                    }
                },
                raw: true
            }).then((res) => {
                res.forEach((element) => {
                    ids.push(element.id);
                });
            });
        }

        return ids;
    } catch (error) {
        throw new Error(`${error}, traceback getRoomChatMemberIdIsPartner()`);
    }
}

async function getAllRoomChatIdTypeNormalBaseOnUserId(userId) {
    try {
        const listRoomChatId = [];
        const _result = await RoomChatMember.findAll({
            where: {
                userId: userId
            },
            include: [
                {
                    model: RoomChat,
                    where: {
                        isDeleted: false
                        // typeRoom: {
                        //   [Op.or]: [null, TypeChatRoom.NORMAL],
                        // },
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
        throw new Error(`${error}, traceback getAllRoomChatIdTypeNormalBaseOnUserId()`);
    }
}

async function getAllRoomChatIdTypeCustomerServiceBaseOnUserId(userId) {
    try {
        const listRoomChatId = [];
        const _result = await RoomChatMember.findAll({
            // where: {
            //     userId: userId
            // },
            include: [
                {
                    model: RoomChat,
                    where: {
                        isDeleted: false
                        // typeRoom: {
                        //   [Op.or]: [
                        //     TypeChatRoom.CUSTOMER_SERVICE,
                        //     TypeChatRoom.CUSTOMER_SERVICE_NO_LOGIN,
                        //   ],
                        // },
                    }
                }
            ],
            raw: true
        }).then((res) => {
            res.forEach((element) => {
                if (element['RoomChat.id'] && !listRoomChatId.includes(element['RoomChat.id'])) {
                    listRoomChatId.push(element['RoomChat.id']);
                }
            });
        });

        return listRoomChatId;
    } catch (error) {
        throw new Error(`${error}, traceback getAllRoomChatIdTypeCustomerServiceBaseOnUserId()`);
    }
}

async function getlistRoomChatMemberIdOfCurrentUser(userId) {
    try {
        const listId = [];
        const rowsData = await RoomChatMember.findAll({
            where: {
                userId: userId,
                isDeleted: false
            },
            attributes: ['id'],
            raw: true
        });

        rowsData.forEach((element) => {
            listId.push(element.id);
        });

        return listId;
    } catch (error) {
        throw new Error(`${error}, traceback getlistRoomChatMemberIdOfCurrentUser()`);
    }
}

async function checkTheyHasDialogBefor(userSourceId, userTargetId) {
    let check = await RoomChatMember.findAll({
        where: {
            [Op.or]: [
                { userId: userSourceId, isDeleted: false },
                { userId: userTargetId, isDeleted: false }
            ]
        },
        attributes: ['roomChatId'],
        group: ['roomChatId'],
        having: Sequelize.literal('count(*) = 2')
    });
    return check;
}

async function getAllRoomChatMemberIdByUserId(userId) {
    try {
        const listRoomChatMember = await RoomChatMember.findAll({
            where: { userId: userId },
            attributes: ['id'],
            raw: true
        });

        return listRoomChatMember;
    } catch (error) {
        return null;
    }
}

async function getAllRoomChatMemberNotCurrentUser(user_id) {
    try {
        const listRoomChatId = await getAllRoomChatIdBaseOnUserId(user_id);

        const roomChatMemberNotCurrentUser = await RoomChatMember.findAll({
            where: {
                userId: {
                    [Op.not]: user_id
                },
                roomChatId: {
                    [Op.in]: listRoomChatId
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'email', 'fullname', 'phone']
                }
            ],
            raw: true
        });

        return roomChatMemberNotCurrentUser;
    } catch (error) {
        return null;
    }
}

async function getListRoomChatMemberByRoomChatId(roomChatId) {
    try {
        const listRoomChatMember = await RoomChatMember.findAll({
            where: {
                roomChatId: roomChatId
            }
        });

        return listRoomChatMember;
    } catch (error) {
        throw new Error(`${error}, traceback getListRoomChatMemberByRoomChatId()`);
    }
}

async function getAllRoomChatBaseOnUserId(userId) {
    try {
        const result = await RoomChatMember.findAll({
            where: { userId: userId },
            attributes: ['roomChatId']
        });

        return result;
    } catch (error) {
        throw new Error(`${error}, traceback getAllRoomChatBaseOnUserId()`);
    }
}

async function getAllRoomChatMemberByRoomChatId(roomChatId, exceptRoomChatMemberId = null) {
    const listRoomChatMember = await RoomChatMember.findAll({
        where: {
            roomChatId: roomChatId,
            id: {
                [Op.not]: exceptRoomChatMemberId
            }
        },
        attributes: ['id'],
        raw: true
    });
    return listRoomChatMember;
}

async function getAllRoomChatMemberByUserId(userId) {
    try {
        const listRoomChatMember = await RoomChatMember.findAll({
            where: { userId: userId },
            attributes: ['id'],
            raw: true
        });

        return listRoomChatMember;
    } catch (error) {
        throw new Error(`${error}, traceback getAllRoomChatMemberByUserId()`);
    }
}

async function getChatRoomMemberIdByRoomChatIdAndUserId(roomChatId, userId) {
    try {
        const chatRoomMember = await RoomChatMember.findOne({
            where: {
                [Op.and]: [{ roomChatId: roomChatId }, { userId: userId }]
            },
            attributes: ['id']
        });

        if (chatRoomMember) {
            return chatRoomMember.dataValues.id;
        } else {
            return null;
        }
    } catch (error) {
        throw new Error(`${error}, traceback getChatRoomMemberIdByRoomChatIdAndUserId()`);
    }
}

// const TypeChatRoom = Object.freeze({
//   CUSTOMER_SERVICE_NO_LOGIN: "CUSTOMER_SERVICE_NO_LOGIN",
//   CUSTOMER_SERVICE: "CUSTOMER_SERVICE",
//   NORMAL: "NORMAL",
// });

// const TypeChatRoomMember = Object.freeze({
//   Internal: "Internal",
//   External: "External",
// });
