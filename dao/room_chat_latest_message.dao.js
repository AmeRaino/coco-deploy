import {
    RoomChatLatestMessage,
    RoomChatMessage,
    RoomChatMember,
    RoomChat,
    EndUserInfo,
    User,
    RoomChatNotification,
    RoomChatAttachment
} from '../models';
import { Op } from 'sequelize';
import { getRoomChatMemberIdIsPartner, getlistRoomChatMemberIdOfCurrentUser } from './room_chat_member.dao';
import { queryPermissionSysByUserId, restrictToSysChats } from './user.dao';

module.exports = {
    getRoomChatLatestMessage,
    insertRoomChatLatestMessage
};

function renderData(element) {
    const obj = {};
    obj['id'] = element['RoomChatMessage.id'];
    obj['roomChatMemberId'] = element['RoomChatMessage.roomChatMemberId'];
    if (element['RoomChatMessage.RoomChatAttachments.id']) {
        obj['message'] = `File attachment ${element['RoomChatMessage.RoomChatAttachments.originalNameAttachment']}`;
    } else {
        obj['message'] = element['RoomChatMessage.isDeleted'] ? 'Your message is revoked' : element['RoomChatMessage.message'];
    }
    obj['createdAt'] = element['RoomChatMessage.createdAt'];
    obj['updatedAt'] = element['RoomChatMessage.updatedAt'];
    obj['isEdited'] = element['RoomChatMessage.isEdited'];
    obj['isDeleted'] = element['RoomChatMessage.isDeleted'];
    obj['roomChatId'] = element['RoomChatMessage.roomChatId'];
    obj['RoomChatMember.id'] = element['RoomChat.RoomChatMembers.id'];
    obj['RoomChatMember.User.id'] = null;
    obj['RoomChatMember.User.avatar'] = null;
    obj['partnerId'] = element['RoomChat.RoomChatMembers.userId'];
    obj['partnerEmail'] = element['RoomChat.RoomChatMembers.User.email']
        ? element['RoomChat.RoomChatMembers.User.email']
        : element['RoomChat.RoomChatMembers.EndUserInfos.email'];
    obj['partnerFullname'] = element['RoomChat.RoomChatMembers.User.fullName']
        ? element['RoomChat.RoomChatMembers.User.fullName']
        : element['RoomChat.RoomChatMembers.EndUserInfos.fullName'];
    obj['partnerPhone'] = element['RoomChat.RoomChatMembers.User.phone']
        ? element['RoomChat.RoomChatMembers.User.phone']
        : element['RoomChat.RoomChatMembers.EndUserInfos.phoneNumber'];
    //   obj["partnerType"] = element["RoomChat.RoomChatMembers.memberType"];
    obj['isSeen'] = 0;

    if (obj['partnerEmail'] === '') {
        obj['partnerEmail'] = obj['partnerPhone'];
    }
    return obj;
}

async function getRoomChatLatestMessage(userId, listRoomChatId, page, limit, search, type, field, sort) {
    try {
        let listPartnerId = [];
        const finalResult = [];
        const listRoomChatMemberOfCurrentUser = await getlistRoomChatMemberIdOfCurrentUser(userId);

        const permissionSys = await queryPermissionSysByUserId(userId);
        if (permissionSys.name === 'End User') {
            return { count: 0, rows: [] };
        }
        const isRoleContent = await restrictToSysChats(permissionSys.permission_sys, { chat_end_user: 'view' });
        if (isRoleContent) {
            const roomChatWithEndUser = await RoomChat.findAll({
                where: {
                    typeRoom: 'CUSTOMER_SERVICE',
                    isDeleted: false
                }
            });
            if (roomChatWithEndUser.length > 0) {
                roomChatWithEndUser.forEach((e) => {
                    listRoomChatId.push(e.id);
                });
            }

            listPartnerId = await getRoomChatMemberIdIsPartner(userId, true);
        } else {
            listPartnerId = await getRoomChatMemberIdIsPartner(userId, false);
        }

        let mainWhereStatement = {};
        mainWhereStatement = {
            roomChatId: {
                [Op.in]: listRoomChatId
            }
        };

        let order = [];
        if ((field, sort)) {
            if (fields[field] === fields['receiver']) {
                let sorts = ['RoomChat', 'RoomChatMembers', 'EndUserInfos', 'email', sort];
                order.push(sorts);
                sorts = ['RoomChat', 'RoomChatMembers', 'EndUserInfos', 'phoneNumber', sort];
                order.push(sorts);
                sorts = ['RoomChat', 'RoomChatMembers', 'User', 'email', sort];
                order.push(sorts);
                sorts = ['RoomChat', 'RoomChatMembers', 'User', 'phone', sort];
                order.push(sorts);
            }
            if (fields[field] === fields['message']) {
                let sorts = ['RoomChatMessage', 'message', sort];
                order.push(sorts);
            }
            // if (fields[field] === fields["type"]) {
            //   let sorts = ["RoomChat", "RoomChatMembers", "memberType", sort];
            //   order.push(sorts);
            // }
        }

        let whereStatementGetPartner = {};
        whereStatementGetPartner = {
            id: {
                [Op.in]: listPartnerId
            }
        };

        // if (type) {
        //   whereStatementGetPartner["$RoomChat.RoomChatMembers.memberType$"] = type;
        // }

        let roomChatMemberId = [];
        if (search) {
            const listRoomChatMember = await RoomChatMember.findAll({
                where: {
                    [Op.and]: {
                        roomChatId: listRoomChatId,
                        [Op.or]: {
                            '$User.email$': {
                                [Op.like]: `%${search}%`
                            },
                            '$User.phone$': {
                                [Op.like]: `%${search}%`
                            },
                            '$EndUserInfos.email$': {
                                [Op.like]: `%${search}%`
                            },
                            '$EndUserInfos.phoneNumber$': {
                                [Op.like]: `%${search}%`
                            }
                        },
                        userId: {
                            [Op.or]: {
                                [Op.ne]: userId,
                                [Op.is]: null
                            }
                        }
                    }
                },
                include: [
                    {
                        model: EndUserInfo,
                        required: false
                    },
                    {
                        model: User,
                        required: false
                    }
                ],
                raw: true
            });
            listRoomChatMember.forEach((element) => {
                roomChatMemberId.push(element.id);
            });

            whereStatementGetPartner['id'] = {
                [Op.in]: roomChatMemberId
            };
        }

        const query = await RoomChatLatestMessage.findAndCountAll({
            where: mainWhereStatement,
            subQuery: false,
            attributes: ['id', 'updatedAt'],
            include: [
                {
                    model: RoomChatMessage,
                    include: [
                        {
                            model: RoomChatAttachment
                        }
                    ]
                },
                {
                    model: RoomChat,
                    required: true,
                    include: [
                        {
                            model: RoomChatMember,
                            where: whereStatementGetPartner,
                            include: [
                                {
                                    model: EndUserInfo,
                                    required: false,
                                    attributes: ['id', 'fullName', 'email', 'phoneNumber']
                                },
                                {
                                    model: User,
                                    required: false,
                                    attributes: ['id', 'fullName', 'email', 'phone']
                                }
                            ]
                        }
                    ]
                }
            ],
            order: order,
            // logging: console.log,
            // order: [['RoomChat','RoomChatMembers','EndUserInfos','email', sort]],
            limit: limit,
            offset: (page - 1) * limit,
            raw: true
        });

        const roomChatNotification = await RoomChatNotification.findAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: listRoomChatMemberOfCurrentUser
                }
            },
            include: [
                {
                    model: RoomChatMember,
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            attributes: ['id']
                        },
                        {
                            model: RoomChat,
                            attributes: ['id']
                        }
                    ]
                }
            ],
            raw: true
        });

        let { count, rows } = query;
        // this part for render data, make it like the old api
        rows.forEach((element) => {
            const obj = renderData(element);
            if (obj['partnerEmail']) {
                finalResult.push(obj);
            }
        });

        // this part for mapping notification
        for (let i = 0; i < finalResult.length; i++) {
            for (let j = 0; j < roomChatNotification.length; j++) {
                if (
                    userId == roomChatNotification[j]['RoomChatMember.User.id'] &&
                    finalResult[i].roomChatId == roomChatNotification[j]['RoomChatMember.RoomChat.id']
                ) {
                    finalResult[i]['isSeen'] = roomChatNotification[j].isSeen;
                }
            }
        }

        if (finalResult.length % limit !== 0 && search) {
            count = finalResult.length;
        }
        return { count: count, rows: finalResult };
    } catch (error) {
        throw new Error(`${error}, traceback getRoomChatLatestMessage()`);
    }
}

async function insertRoomChatLatestMessage(roomChatMessageId, roomChatId) {
    try {
        const latestMessage = await RoomChatLatestMessage.findOne({
            where: {
                roomChatId: roomChatId
            }
        });
        if (latestMessage) {
            latestMessage.roomChatMessageId = roomChatMessageId;
            latestMessage.updatedAt = new Date();
            await latestMessage.save();
        } else {
            const cre = await RoomChatLatestMessage.create({
                roomChatMessageId: roomChatMessageId,
                roomChatId: roomChatId,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    } catch (error) {
        throw new Error(`${error}, traceback insertRoomChatLatestMessage()`);
    }
}

const fields = {
    receiver: 'receiver',
    message: 'message',
    type: 'type'
};
