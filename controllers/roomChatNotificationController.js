import { RoomChatNotification } from '../models';
import { Op } from 'sequelize';
import { ReE, ReS } from '../utils/util.service';
import { errorCode } from '../utils/util.helper';
import { getAllRoomChatMemberIdByUserId, getAllRoomChatMemberNotCurrentUser, getAllRoomChatMemberByUserId } from '../dao/room_chat_member.dao';
import { getLatestChatMessageByChatRoomMemberId } from '../dao/room_chat_message.dao';
import { getAllChatNotificationByCurrentUser } from '../dao/room_chat_notification.dao';

export async function createNotification(roomChatMemberId, isJoinRoom = false) {
    try {
        const createNoti = await RoomChatNotification.findOne({
            where: {
                roomChatMemberId: roomChatMemberId
            }
        }).then(async function (noti) {
            if (noti) {
                noti.isSeen = isJoinRoom === true ? true : false;
                return await noti.save();
            } else {
                const isSeen = isJoinRoom === true ? true : false;
                return await RoomChatNotification.create({
                    roomChatMemberId: roomChatMemberId,
                    isSeen: isSeen
                });
            }
        });

        return createNoti;
    } catch (err) {
        console.log(err);
    }
}

export async function seenNotification(req, res, next) {
    try {
        const { roomChatMemberId } = req.body;
        if (!roomChatMemberId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp roomChatMemberId'
                },
                400,
                errorCode.DataNull
            );
        }
        const noti = await RoomChatNotification.findOne({
            where: {
                roomChatMemberId: roomChatMemberId
            }
        });
        if (!noti) {
            return ReS(
                res,
                {
                    message: 'roomChatMemberId chưa được tạo notification'
                },
                200
            );
        }
        noti.isSeen = true;
        await noti.save();
        return ReS(
            res,
            {
                message: 'Notification đã được xem'
            },
            200
        );
    } catch (err) {
        next(err);
    }
}

export async function seenAllNotification(req, res, next) {
    try {
        const { userId } = req.body;
        if (!userId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp userId'
                },
                400,
                errorCode.DataNull
            );
        }
        const listRoomChatMember = await getAllRoomChatMemberByUserId(userId);

        const keepIds = [];
        listRoomChatMember.forEach((element) => {
            keepIds.push(element.id);
        });

        const listNoti = await RoomChatNotification.findAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: keepIds
                }
            }
        });

        const promise = listNoti.map((element) => {
            element.isSeen = true;
            const saveNoti = element.save();
            return saveNoti;
        });

        const resolve = Promise.all(promise).then((_) => {
            return ReS(
                res,
                {
                    message: 'Đọc notifications thành công'
                },
                200
            );
        });

        return resolve;
    } catch (err) {
        next(err);
    }
}

export async function seenNotificationAuto(roomChatMemberId) {
    try {
        const noti = await RoomChatNotification.findOne({
            where: {
                roomChatMemberId: roomChatMemberId
            }
        }).then(async function (noti) {
            if (noti) {
                noti.isSeen = true;
                return await noti.save();
            } else {
                return await RoomChatNotification.create({
                    roomChatMemberId: roomChatMemberId,
                    isSeen: true
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

export async function checkIsHaveNotification(req, res, next) {
    try {
        const { userId } = req.body;

        if (!userId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp userId'
                },
                400,
                errorCode.DataNull
            );
        }
        const listRoomChatMemberId = await getAllRoomChatMemberByUserId(userId);
        const parseToListInt = [];
        listRoomChatMemberId.forEach((element) => {
            parseToListInt.push(element.id);
        });

        const result = await RoomChatNotification.findAll({
            where: {
                roomChatMemberId: {
                    [Op.in]: parseToListInt
                }
            },
            raw: true
        });
        return ReS(
            res,
            {
                message: 'Kết quả trả về thông báo chat cho người dùng',
                data: result
            },
            200
        );
    } catch (err) {
        next(err);
    }
}

async function parseArrRoomChatMemberIdByUserIdToArrayNumber(userId) {
    try {
        const listRoomChatMemberId = await getAllRoomChatMemberIdByUserId(userId);
        const parseToListInt = [];
        listRoomChatMemberId.forEach((element) => {
            parseToListInt.push(element.id);
        });
        return parseToListInt;
    } catch (error) {
        return [];
    }
}

export async function checkIsHaveNotificationMobile(req, res, next) {
    try {
        const { userId } = req.body;
        if (!userId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp userId'
                },
                400,
                errorCode.DataNull
            );
        }

        const listId = await parseArrRoomChatMemberIdByUserIdToArrayNumber(userId);

        const { _count, rows } = await getAllChatNotificationByCurrentUser(listId);

        const listLatesMessage = await getLatestChatMessageByChatRoomMemberId(listId);

        const addi = await getAllRoomChatMemberNotCurrentUser(userId);

        rows.forEach((e) => {
            listLatesMessage.forEach((e2) => {
                if (e.roomChatMemberId === e2.roomChatMemberId) {
                    e['message'] = e2['message'];
                }
            });
            if (addi) {
                addi.forEach((e3) => {
                    if (e['RoomChatMember.RoomChat.id'] === e3.roomChatId) {
                        e['partnerId'] = e3['User.id'];
                        e['partnerEmail'] = e3['User.email'];
                        e['partnerFullname'] = e3['User.fullname'];
                        e['partnerPhone'] = e3['User.phone'];
                        // e["partnerType"] = e["memberType"];
                    }
                });
            }
        });

        return ReS(
            res,
            {
                message: 'Kết quả trả về thông báo chat cho người dùng',
                data: rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function countUnSeenNotification(req, res, next) {
    try {
        const { userId } = req.body;
        if (!userId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp userId'
                },
                400,
                errorCode.DataNull
            );
        }

        const listId = await parseArrRoomChatMemberIdByUserIdToArrayNumber(userId);

        const { count, rows } = await getAllChatNotificationByCurrentUser(listId);
        return ReS(
            res,
            {
                message: 'Kết quả trả về thông báo chat cho người dùng',
                data: count
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
