import { ReE, ReS } from '../utils/util.service';
import { errorCode } from '../utils/util.helper';
import { createNotification, seenNotificationAuto } from './roomChatNotificationController';
import { queryPermissionSysByUserId, restrictToSysChats, getEndUserLoginInfor } from '../dao/user.dao';
import { createChatMessage, findMessageByPk } from '../dao/room_chat_message.dao';
import { getAllRoomChatMemberByRoomChatId } from '../dao/room_chat_member.dao';
import { insertRoomChatLatestMessage } from '../dao/room_chat_latest_message.dao';
import NodeCache from 'node-cache';
import _ from 'lodash';

const myCache = new NodeCache();

module.exports = {
    createMessage,
    deleteMessage,
    initSocketChatServer
};

async function createMessage(roomChatMemberId, roomChatId, message) {
    try {
        if (!roomChatMemberId) {
            return {
                success: false,
                message: 'Vui lòng cung cấp roomChatMemberId'
            };
        }

        if (!message.trim()) {
            return {
                success: false,
                message: 'Không tìm thấy đoạn tin nhắn'
            };
        }

        const chatMessage = await createChatMessage(roomChatMemberId, message, roomChatId);

        await insertRoomChatLatestMessage(chatMessage.id, roomChatId);
        return {
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: {
                roomChatId: roomChatId,
                roomChatMemberId: chatMessage.dataValues.roomChatMemberId,
                id: chatMessage.dataValues.id,
                message: chatMessage.dataValues.message,
                createdAt: chatMessage.dataValues.createdAt
            }
        };
    } catch (err) {
        console.log(error);
        return {
            success: false,
            message: 'Có lỗi khi gửi tin nhắn. có thể là do member không gửi đúng tin nhắn vào phòng chat'
        };
    }
}

async function deleteMessage(req, res, next) {
    try {
        const { roomChatMessageId, roomChatMemberId } = req.body;
        if (!roomChatMessageId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp roomChatMessageId'
                },
                400,
                errorCode.DataNull
            );
        }
        const mess = await findMessageByPk(roomChatMessageId);
        if (!mess) {
            return ReS(
                res,
                {
                    success: true,
                    message: 'Không thể tìm thấy tin nhắn'
                },
                200
            );
        }
        if (mess.roomChatMemberId === roomChatMemberId) {
            mess.isDeleted = true;
            mess.updatedAt = new Date();
            await mess.save();
            return ReS(
                res,
                {
                    success: true,
                    message: 'Xoá tin nhắn thành công'
                },
                200
            );
        } else {
            return ReS(
                res,
                {
                    success: true,
                    message: 'Bạn không có quyền để xoá tin nhắn này'
                },
                200
            );
        }
    } catch (err) {
        next(err);
    }
}

async function initSocketChatServer(io) {
    io.on('connection', function (socket) {
        console.log('client is connect');

        socket.on('disconnect', function () {});

        socket.on('client-active', async function (data) {
            const cacheKey = `ONLINE_USERS_${data.senderUserId}`;
            let onlineUsers = myCache.get(cacheKey) || {};

            if (!_.has(onlineUsers, `${data.senderUserId}`)) {
                const user = await getEndUserLoginInfor(data.senderUserId);

                onlineUsers[data.senderUserId] = user;

                myCache.set(cacheKey, onlineUsers);
            }

            socket.broadcast.emit(`${data.senderUserId}`, onlineUsers);
        });

        socket.on('client-inactive', async function (data) {
            const cacheKey = `ONLINE_USERS_${data.senderUserId}`;
            let onlineUsers = myCache.get(cacheKey) || {};

            if (_.has(onlineUsers, `${data.senderUserId}`)) {
                delete onlineUsers[data.senderUserId];

                myCache.set(cacheKey, onlineUsers);
            }

            socket.broadcast.emit(`${data.senderUserId}`, onlineUsers);
        });

        socket.on('Client-sent-data', async function (data) {
            const permissionSys = await queryPermissionSysByUserId(data.senderUserId);
            const isHasPermission = await restrictToSysChats(permissionSys.permission_sys, { chats: 'new' });

            if (isHasPermission) {
                // this function push new message to database
                let finalMessage = null;

                if (data.attachment && data.attachment.length > 0) {
                    finalMessage = data.attachment;
                } else {
                    const createMess = await createMessage(data.roomChatMemberId, data.roomChatId, data.message);

                    finalMessage = createMess;
                }

                // get all room chat member then push notification isSeen = false to each person export member who was sent message
                const listRoomChatMemberId = await getAllRoomChatMemberByRoomChatId(data.roomChatId, data.roomChatMemberId);

                if (listRoomChatMemberId.length > 0) {
                    listRoomChatMemberId.map(async (element) => {
                        await createNotification(element.id);
                    });
                }
                await seenNotificationAuto(data.roomChatMemberId);
                const endUserInfo = await getEndUserLoginInfor(data.senderUserId);
                // emit message back for sender
                // socket.emit(`${data.roomChatId}`, createMess);
                // emit message for specific user who in this roomChat without sender
                socket.broadcast.emit(`${data.roomChatId}`, finalMessage);
                // emit notification for all user, if someone belong to that room. make them listen that roomChat socket
                socket.broadcast.emit('Server-send-all-user', {
                    message: 'Vừa có một tin nhắn mới gửi tới phòng chat, hay check notification chat',
                    roomchatId: data.roomChatId,
                    senderUserId: data.senderUserId,
                    senderEmail: endUserInfo.email ? endUserInfo.email : endUserInfo.email.phone,
                    senderAvatar: endUserInfo.avatar,
                    receiverUserId: data.receiverUserId
                });
            }
        });
    });
}
