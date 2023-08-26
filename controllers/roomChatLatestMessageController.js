import { getRoomChatLatestMessage } from '../dao/room_chat_latest_message.dao';
import { getAllRoomChatIdBaseOnUserId } from '../dao/room_chat.dao';
import { ReE, ReS } from '../utils/util.service';
import { errorCode } from '../utils/util.helper';

module.exports = {
    getRoomChatLatestMessageController
};

async function getRoomChatLatestMessageController(req, res, next) {
    try {
        const { userId, limit, page, type, field, sort, search } = req.body;

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
        if (!limit) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp limit'
                },
                400,
                errorCode.DataNull
            );
        }
        if (!page) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp page'
                },
                400,
                errorCode.DataNull
            );
        }
        if (type === null) {
            return ReE(
                res,
                {
                    message: 'Vui lòng cung cấp type'
                },
                400,
                errorCode.DataNull
            );
        }

        if (field && !fields[field]) {
            return ReE(
                res,
                {
                    message: 'Field bạn muốn sort không được hổ trợ'
                },
                400,
                errorCode.DataNull
            );
        }

        if (sort && !sorts[sort]) {
            return ReE(
                res,
                {
                    message: 'Kiểu sort phải là DESC hoặc ASC'
                },
                400,
                errorCode.DataNull
            );
        }

        const listRoomChatId = await getAllRoomChatIdBaseOnUserId(userId);
        const { count, rows } = await getRoomChatLatestMessage(userId, listRoomChatId, page, limit, search, type, field, sort);

        return ReS(
            res,
            {
                message: 'Danh sách chat của user là',
                data: rows,
                count: count
            },
            200
        );
    } catch (error) {
        throw new Error(`${error}, traceback getRoomChatLatestMessageController()`);
    }
}

const fields = {
    receiver: 'receiver',
    message: 'message',
    type: 'type'
};

const sorts = {
    DESC: 'DESC',
    ASC: 'ASC'
};
