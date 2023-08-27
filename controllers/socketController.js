import { OnlineStatus, ConversationMember, ConversationMessage, ConversationLastMessage, User } from '../models';

async function initSocket(io) {
    io.on('connection', function (socket) {
        console.log('A client has connected!');

        socket.on('client-connection', () => {
            io.emit('server-connection', 'OK');
        });

        socket.on('client-active-user', async (data) => {
            try {
                io.emit('server-active-user', data);

                const updatedData = {
                    userId: data?.userId,
                    isOnline: true,
                    lastOnlineAt: new Date()
                };

                await OnlineStatus.upsert(updatedData);
            } catch (error) {
                console.log('socket.client-active-user', error);
            }
        });

        socket.on('client-inactive-user', async (data) => {
            try {
                io.emit('server-inactive-user', data);

                const updatedData = {
                    userId: data?.userId,
                    isOnline: false,
                    lastOnlineAt: new Date()
                };

                await OnlineStatus.upsert(updatedData);
            } catch (error) {
                console.log('socket.client-inactive-user', error);
            }
        });

        socket.on('client-message', async (data) => {
            try {
                const newMessage = await ConversationMessage.create({
                    conversationId: data?.conversationId,
                    memberId: data?.memberId,
                    content: data?.content,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const lastMessage = await ConversationLastMessage.findOne({
                    where: {
                        conversationId: data?.conversationId
                    }
                });

                const lastMessageBody = {
                    conversationId: data?.conversationId,
                    messageId: newMessage?.id,
                    userId: data?.userId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                if (lastMessage) {
                    await ConversationLastMessage.update(lastMessageBody, {
                        where: {
                            conversationId: data?.conversationId
                        }
                    });
                } else {
                    await ConversationLastMessage.create(lastMessageBody);
                }

                const preview = await ConversationMessage.findOne({
                    where: {
                        id: newMessage?.id
                    },
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
                    attributes: ['id', 'conversationId', 'content', 'createdAt']
                });

                io.emit('server-message', preview);
            } catch (error) {
                console.log('socket.client-message', error);
            }
        });
    });
}

module.exports = {
    initSocket
};
