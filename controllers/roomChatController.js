import { ReE, ReS } from '../utils/util.service';
import { errorCode } from '../utils/util.helper';
import { getAllChatMessageByRoomMemberId } from '../dao/room_chat_message.dao';
import { initChatRoomForEndUserHasLogin, createChatRoom, findRoomChatByPk } from '../dao/room_chat.dao';
import {
    createChatRoomMember,
    checkTheyHasDialogBefor,
    getListRoomChatMemberByRoomChatId,
    getAllRoomChatBaseOnUserId,
    getAllRoomChatMemberByRoomChatId,
    getChatRoomMemberIdByRoomChatIdAndUserId
} from '../dao/room_chat_member.dao';
import { getListRoomChatNotificationFromListRoomChatMemberId } from '../dao/room_chat_notification.dao';

module.exports = {
    getAllRoomChatMessage,
    createChatRoomController,
    createChatRoomForEndUserHasLogin,
    deleteChatRoom,
    getAllRoomChatBaseOnUserIdController
};

async function getAllRoomChatMessage(roomChatId, limit, page) {
    const listRoomChatMemberId = await getAllRoomChatMemberByRoomChatId(roomChatId);
    const Ids = [];
    listRoomChatMemberId.forEach((element) => {
        Ids.push(element.id);
    });
    const listRoomChatMessage = await getAllChatMessageByRoomMemberId(Ids, limit, page);
    return listRoomChatMessage;
}

async function createChatRoomController(req, res, next) {
    try {
        const { userSourceId, userTargetId, limit, page } = req.body;
        if (!userSourceId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp userSourceId'
                },
                400,
                errorCode.DataNull
            );
        }
        if (!userTargetId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp userTargetId'
                },
                400,
                errorCode.DataNull
            );
        }
        const check = await checkTheyHasDialogBefor(userSourceId, userTargetId);
        if (check.length === 0) {
            const roomChat = await createChatRoom(userSourceId);

            const roomChatMemberSource = await createChatRoomMember(
                userSourceId,
                roomChat.dataValues.id
                // TypeChatRoomMember.Internal
            );

            const roomChatMemberTarget = await createChatRoomMember(
                userTargetId,
                roomChat.dataValues.id
                // TypeChatRoomMember.Internal
            );

            return ReS(
                res,
                {
                    message: 'Tạo phòng chat mới thành công',
                    isFirstTime: true,
                    roomChatId: roomChat.dataValues.id,
                    roomChatMemberId: roomChatMemberSource.id
                },
                200
            );
        } else {
            const chatRoomId = check[0].dataValues.roomChatId;
            const listMessage = await getAllRoomChatMessage(chatRoomId, limit, page);
            const chatRoomMemberId = await getChatRoomMemberIdByRoomChatIdAndUserId(chatRoomId, userSourceId);
            return ReS(
                res,
                {
                    message: 'Phòng chat này đã tồn tại',
                    isFirstTime: false,
                    roomChatId: chatRoomId,
                    roomChatMemberId: chatRoomMemberId,
                    data: listMessage
                },
                200
            );
        }
    } catch (err) {
        console.log('err--', err);
        next(err);
    }
}

async function createChatRoomForEndUserHasLogin(req, res, next) {
    try {
        const { userId, page, limit } = req.body;

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

        const checkIsAnonymouseUser = await isUserAnonymouse(userId);

        if (checkIsAnonymouseUser) {
            const { isHadChatRoom, roomChatMember } = await initChatRoomForEndUserHasLogin(userId);
            const listMessage = await getAllRoomChatMessage(roomChatMember.roomChatId, limit, page);
            return ReS(
                res,
                {
                    message: 'Tạo phòng chat mới thành công',
                    isFirstTime: !isHadChatRoom,
                    roomChatId: roomChatMember.roomChatId,
                    roomChatMemberId: roomChatMember.id,
                    listMessage: listMessage
                },
                200
            );
        } else {
            return ReE(
                res,
                {
                    message: 'Bạn không có quyền để thực hiện chức năng này'
                },
                500,
                errorCode.Block
            );
        }
    } catch (error) {
        next(error);
    }
}

async function deleteChatRoom(req, res, next) {
    try {
        const { roomChatId } = req.body;
        if (!roomChatId) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp roomChatId'
                },
                400,
                errorCode.DataNull
            );
        }
        const result = await findRoomChatByPk(roomChatId);
        if (!result) {
            return ReS(
                res,
                {
                    success: true,
                    message: 'Phòng chat không tồn tại'
                },
                200
            );
        } else {
            result.isDeleted = true;

            const listRoomChatMember = await getListRoomChatMemberByRoomChatId(result.id);

            const rawListMemberId = [];

            listRoomChatMember.forEach(async (element) => {
                element.isDeleted = true;
                rawListMemberId.push(element.id);
                await element.save();
            });

            const listNotificationOfListMemberId = await getListRoomChatNotificationFromListRoomChatMemberId(rawListMemberId);

            listNotificationOfListMemberId.forEach(async (element) => {
                element.isSeen = true;
                await element.save();
            });

            await result.save();
            return ReS(
                res,
                {
                    success: true,
                    message: 'Xoá phòng chat thành công'
                },
                200
            );
        }
    } catch (err) {
        next(err);
    }
}

async function getAllRoomChatBaseOnUserIdController(req, res, next) {
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

        const result = await getAllRoomChatBaseOnUserId(userId);

        return ReS(
            res,
            {
                message: 'Danh sach roomChatId của user là',
                data: result
            },
            200
        );
    } catch (err) {
        console.log(err);
        next(err);
    }
}

// export const TypeChatRoomMember = Object.freeze({
//   Internal: "Internal",
//   External: "External",
// });
