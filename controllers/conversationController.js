import { ReE, ReS } from '../utils/util.service';
import { Op } from 'sequelize';
import {
    OnlineStatus,
    Conversation,
    ConversationMember,
    ConversationMessage,
    User,
    ConversationLastMessage,
    ConversationReadMessage
} from '../models';
import md5 from 'crypto-js/md5';
import { getTranslate } from '../utils/translate';
import { errorCode } from '../utils/util.helper';

export async function getAll(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'createdAt', search = '', arrangement = 'DESC' } = req.query;
        const { userId } = req.params;

        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }

        const joinedConversations = await ConversationMember.findAll({
            where: {
                userId
            },
            attributes: ['conversationId']
        });

        console.log(joinedConversations?.map((conversation) => conversation?.conversationId));

        const { count, rows } = await ConversationLastMessage.findAndCountAll({
            where: {
                conversationId: {
                    [Op.in]: joinedConversations?.map((conversation) => conversation?.conversationId)
                },
                isDeleted: false
            },
            subQuery: false,
            required: true,
            include: [
                {
                    model: Conversation,
                    as: 'conversation',
                    include: [
                        {
                            model: ConversationMember,
                            as: 'conversation_members',
                            include: [
                                {
                                    model: User,
                                    as: 'user',
                                    attributes: ['id', 'email', 'fullname', 'phone', 'avatar', 'gender']
                                }
                            ]
                        }
                    ]
                },
                {
                    model: ConversationMessage,
                    where: {
                        isDeleted: false
                    },
                    as: 'message',
                    include: [
                        {
                            model: ConversationMember,
                            as: 'member',
                            attributes: ['id'],
                            include: [
                                {
                                    model: User,
                                    as: 'user',
                                    attributes: ['id', 'email', 'fullname', 'phone', 'avatar', 'gender']
                                }
                            ]
                        },
                        {
                            model: ConversationReadMessage,
                            as: 'read_by',
                            attributes: ['userId']
                        }
                    ]
                }
            ],
            attributes: {
                exclude: ['uid', 'createdBy', 'isDeleted', 'updatedAt']
            },
            limit: amount * 1,
            offset: page * amount,
            order: [[order, arrangement]]
            // raw: true,
        });

        return ReS(
            res,
            {
                message: 'Get all conversations successfully!',
                count: count,
                data: rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

export async function getMemberInMessageOfUser (req, res, next) {
    try {
        const userID = req.body.user_id;
        const otherID = req.body.other_id;
        const language = req.body.language;
        const data1 = await ConversationMember.findAndCountAll({
            where: {
                userId: userID
            }
        });

        const data2 = await ConversationMember.findAndCountAll({
            where: {
                userId: otherID
            }
        });

        if(data1.count > 0 && data2.count > 0){
            let tempArr = [];
            data2.rows.forEach(element => {
                tempArr.push(element.conversationId)
            });
            // console.log(tempArr);
    
            let data = [];
            data1.rows.forEach(element => {
                if(tempArr.includes(element.conversationId) === true) { data.push(element) };
            });
            // console.log(data);
    
            if(data.length > 0){
                return ReS(res, {message: getTranslate('get 2 members in 1 conversation successfully!', language), data: data}, 200);
            }
            else {
                return ReS(res, {message: getTranslate('2 users have not chatted already!', language), data: []}, 201);
            }
        }
        else {
            return ReE(res, {message: 'at least 1 in 2 users have not joined any conversation!'}, 500, errorCode.NotFound);
        }
    } catch (error) {
        next(error);
    }
};

export async function getOnlineUsers(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'lastOnlineAt', search = '', arrangement = 'ASC' } = req.query;
        const { userId } = req.params;

        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }

        const joinedConversations = await ConversationMember.findAll({
            where: {
                userId
            },
            attributes: ['conversationId']
        });

        const friendIds = await ConversationMember.findAll({
            where: {
                conversationId: {
                    [Op.in]: joinedConversations?.map((conversation) => conversation?.conversationId)
                }
            },
            attributes: ['userId']
        });

        const { count, rows } = await OnlineStatus.findAndCountAll({
            where: {
                userId: {
                    [Op.in]: friendIds?.map((conversation) => conversation?.userId)
                }
            },
            subQuery: false,
            required: true,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'fullname', 'phone', 'avatar', 'gender']
                }
            ],
            attributes: {
                exclude: ['userId', 'createdBy', 'isDeleted', 'createdAt', 'updatedAt']
            },
            limit: amount * 1,
            offset: page * amount,
            order: [
                ['isOnline', 'desc'],
                [order, arrangement]
            ]
            // raw: true,
        });

        return ReS(
            res,
            {
                message: 'Get online users successfully!',
                count: count,
                data: rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function join(req, res, next) {
    try {
        const { senderId, receiverIds = [] } = req.body;
        let receiverIdsObj = {
            [senderId]: true
        };

        receiverIds.forEach((id) => {
            receiverIdsObj[id] = true;
        });

        let uid = md5(JSON.stringify(receiverIdsObj)).toString();

        let existingItem = await Conversation.findOne({
            where: {
                uid
            }
        });

        if (!existingItem) {
            existingItem = await Conversation.create({
                uid,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            for (let i = 0; i < Object.keys(receiverIdsObj).length; i++) {
                const userId = Object.keys(receiverIdsObj)?.[i];

                await ConversationMember.create({
                    conversationId: existingItem?.id,
                    userId: parseInt(userId),
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }

        const senderMember = await ConversationMember.findOne({
            where: {
                userId: senderId
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'email', 'fullname', 'phone', 'avatar', 'gender']
                }
            ],
            attributes: {
                exclude: ['userId', 'createdBy', 'isDeleted', 'createdAt', 'updatedAt', 'conversationId']
            }
        });

        return ReS(
            res,
            {
                message: 'Join conversation successfully!',
                data: {
                    conversationId: existingItem?.id,
                    senderConversationMemberId: senderMember?.id,
                    senderUser: senderMember?.user
                }
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getMessagesByConversationId(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'createdAt', search = '', arrangement = 'DESC' } = req.query;
        const { conversationId } = req.params;

        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }

        const { count, rows } = await ConversationMessage.findAndCountAll({
            where: {
                conversationId: conversationId,
                isDeleted: false
            },
            subQuery: false,
            required: true,
            include: [
                {
                    model: ConversationMember,
                    as: 'member',
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'email', 'fullname', 'phone', 'avatar', 'gender']
                        }
                    ]
                }
            ],
            attributes: ['id', 'conversationId', 'content', 'createdAt'],
            limit: amount * 1,
            offset: page * amount,
            order: [[order, arrangement]],
            raw: true
        });

        return ReS(
            res,
            {
                message: 'Get conversation messages successfully!',
                count: count,
                data: rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function deleteById(req, res, next) {
    try {
        const { conversationId } = req.params;

        const existingItem = await Conversation.findOne({
            where: {
                id: conversationId
            }
        });

        if (!existingItem) {
            return ReE(
                res,
                {
                    message: 'Conversation not found!'
                },
                500
            );
        } else {
            existingItem.isDeleted = true;
            await existingItem?.save();

            await ConversationLastMessage.destroy({
                where: {
                    conversationId
                }
            });

            return ReS(
                res,
                {
                    message: 'Delete conversation successfully!'
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
}

export async function markAsRead(req, res, next) {
    try {
        const { messageId } = req.params;
        const { userId } = req.body;

        const entry = await ConversationReadMessage.findOne({
            where: {
                messageId,
                userId
            }
        });

        if (!entry) {
            await ConversationReadMessage.create({
                messageId,
                userId: parseInt(userId),
                createdAt: new Date(),
                updatedAt: new Date()
            });

            return ReS(
                res,
                {
                    message: 'Mark message as read successfully!'
                },
                200
            );
        } else {
            return ReS(
                res,
                {
                    message: 'This message has already been marked as read!'
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
}

export async function autoDeleteImage(req, res, next) {
    try {
        
    } catch (error) {
        next(error);
    }
}
