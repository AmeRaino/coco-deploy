import { RoomChatAttachment } from '../models';
import { insertRoomChatLatestMessage } from '../dao/room_chat_latest_message.dao';
import { findOneRoomChatMemberById } from '../dao/room_chat_member.dao';
import { createEmptyMessage } from '../dao/room_chat_message.dao';
const { ReE, ReS } = require('../utils/util.service');

export async function uploadFileForRoomChatMember(req, res, next) {
    try {
        const files = req.files;
        const { roomChatMemberId } = req.body;
        if (files && files.length > 0) {
            const roomChatMember = await findOneRoomChatMemberById(roomChatMemberId);

            const emptyMessage = await createEmptyMessage(roomChatMemberId);

            await insertRoomChatLatestMessage(emptyMessage.id, roomChatMember.roomChatId);

            const promise = files.map((element) => {
                const saveAttachment = RoomChatAttachment.create({
                    roomChatMessageId: emptyMessage.dataValues.id,
                    attachmentPath: element.path,
                    extensionAttachment: element.mimetype,
                    originalNameAttachment: element.originalname,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isEdited: false
                });
                return saveAttachment;
            });

            return Promise.all(promise).then((data) => {
                emptyMessage.dataValues['attachment'] = data;
                return ReS(
                    res,
                    {
                        message: 'Upload file thành công',
                        data: emptyMessage.dataValues
                    },
                    200
                );
            });
        } else {
            return ReE(
                res,
                {
                    message: 'Không thể upload list files rỗng'
                },
                400,
                errorCode.DataNull
            );
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
