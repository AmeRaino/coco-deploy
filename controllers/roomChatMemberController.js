import {
    RoomChatMember,
    RoomChatMessage,
    RoomChatNotification,
    RoomChat,
    sequelize,
    User
    //   Role,
    //   EndUserInfo,
} from '../models';
import { and, Op, Sequelize } from 'sequelize';
import { to, ReE, ReS, TE } from '../utils/util.service';
import { errorCode, successCode } from '../utils/util.helper';
import { queryPermissionSysByUserId, restrictToSysChats } from '../dao/user.dao';

export async function getAllChatRoomAndTheLastesMessageByUserId(req, res, next) {
    try {
        const { userId, limit, page, field, sort } = req.body;
        let { search } = req.body;

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
        // if (type === null) {
        //   return ReE(
        //     res,
        //     {
        //       message: "Vui lòng cung cấp type",
        //     },
        //     400,
        //     errorCode.DataNull
        //   );
        // }

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

        let count = 0;
        let finalResult = null;
        const listRoomChatId = [];
        const listRoomChatMemberId = [];
        const listRoomChatMemberOfCurrentUser = [];
        let errorMessage = '';

        // Check is end user. if is end user return empty
        const permissionSys = await queryPermissionSysByUserId(userId);
        if (permissionSys.name === 'End User') {
            return ReS(
                res,
                {
                    message: 'Danh sách chat của user là',
                    data: [],
                    count: 0
                },
                200
            );
        }

        // check if user has role Content
        // const isRoleContent = await restrictToSysChats(
        //   permissionSys.permission_sys,
        //   { chat_end_user: "view" }
        // );

        // if (isRoleContent) {
        //   const roomChatWithEndUser = await RoomChat.findAll({
        //     where: {
        //       //   typeRoom: "CUSTOMER_SERVICE",
        //       isDeleted: false,
        //     },
        //   });
        //   if (roomChatWithEndUser.length > 0) {
        //     roomChatWithEndUser.forEach((e) => {
        //       listRoomChatId.push(e.id);
        //     });
        //   }
        // }

        const result = await RoomChatMember.findAll({
            where: {
                userId: userId
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
        })
            .then(async (result) => {
                result.forEach((element) => {
                    if (element['RoomChat.id']) {
                        listRoomChatId.push(element['RoomChat.id']);
                    }
                    if (element['id']) {
                        listRoomChatMemberOfCurrentUser.push(element['id']);
                    }
                });
                const result2 = await RoomChatMessage.findAndCountAll({
                    where: {
                        roomChatId: {
                            [Op.in]: listRoomChatId
                        }
                    },
                    attributes: ['roomChatId', [sequelize.fn('max', sequelize.col('createdAt')), 'createdAt']],
                    group: ['roomChatId'],
                    raw: true
                }).then(async (newestMessage) => {
                    count = newestMessage.rows.length;
                    let result3 = await RoomChatMessage.findAll({
                        where: {
                            [Op.and]: {
                                [Op.or]: newestMessage.rows,
                                message: {
                                    [Op.like]: `%${search ? search : ''}%`
                                }
                            }
                        },
                        include: [
                            {
                                model: RoomChatMember,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: User,
                                        attributes: ['id', 'avatar']
                                    }
                                ]
                            }
                        ],
                        order: [['createdAt', 'DESC']],
                        limit: limit,
                        offset: (page - 1) * limit,
                        raw: true
                    });

                    if (result3.length > 0) {
                        search = '';
                    } else {
                        result3 = await RoomChatMessage.findAll({
                            where: {
                                [Op.and]: {
                                    [Op.or]: newestMessage.rows
                                }
                            },
                            order: [['createdAt', 'DESC']],
                            limit: limit,
                            offset: (page - 1) * limit,
                            raw: true
                        });
                    }

                    let roomChatMemberNotCurrentUser = null;

                    let whereStatement = {};
                    if (search) {
                        whereStatement = {
                            email: {
                                [Op.like]: `%${search}%`
                            }
                        };
                    } else {
                        whereStatement = null;
                    }

                    if (search) {
                        roomChatMemberNotCurrentUser = await RoomChatMember.findAll({
                            where: {
                                userId: {
                                    [Op.or]: {
                                        [Op.not]: userId,
                                        [Op.is]: null
                                    }
                                },
                                roomChatId: {
                                    [Op.in]: listRoomChatId
                                }
                            },
                            include: [
                                {
                                    model: User,
                                    attributes: ['id', 'email', 'fullname', 'phone'],
                                    where: {
                                        email: {
                                            [Op.like]: `%${search ? search : ''}%`
                                        }
                                    }
                                }
                                // {
                                //   model: EndUserInfo,
                                //   attributes: ["id", "email", "fullName", "phoneNumber"],
                                // },
                            ],
                            raw: true
                        });
                    } else {
                        roomChatMemberNotCurrentUser = await RoomChatMember.findAll({
                            where: {
                                userId: {
                                    [Op.or]: {
                                        [Op.not]: userId,
                                        [Op.is]: null
                                    }
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
                                // {
                                //   model: EndUserInfo,
                                //   attributes: ["id", "email", "fullName", "phoneNumber"],
                                // },
                            ],
                            raw: true
                        });
                    }

                    result3.forEach((element) => {
                        listRoomChatMemberId.push(element.roomChatMemberId);
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

                    if (roomChatMemberNotCurrentUser.length === 0) {
                        throw new Error('Kết quả tìm kiếm trả về rỗng');
                    }

                    for (let i = 0; i < result3.length; i++) {
                        for (let j = 0; j < roomChatNotification.length; j++) {
                            if (
                                userId == roomChatNotification[j]['RoomChatMember.User.id'] &&
                                result3[i].roomChatId == roomChatNotification[j]['RoomChatMember.RoomChat.id']
                            ) {
                                result3[i]['isSeen'] = roomChatNotification[j].isSeen;
                            }
                        }
                    }

                    for (let i = 0; i < result3.length; i++) {
                        for (let j = 0; j < roomChatMemberNotCurrentUser.length; j++) {
                            if (result3[i].roomChatId === roomChatMemberNotCurrentUser[j].roomChatId && roomChatMemberNotCurrentUser[j]['User.id']) {
                                result3[i]['partnerId'] = roomChatMemberNotCurrentUser[j]['User.id'];
                                result3[i]['partnerEmail'] =
                                    roomChatMemberNotCurrentUser[j]['User.email'] || roomChatMemberNotCurrentUser[j]['User.phone'];
                                result3[i]['partnerFullname'] = roomChatMemberNotCurrentUser[j]['User.fullname'];
                                result3[i]['partnerPhone'] = roomChatMemberNotCurrentUser[j]['User.phone'];
                                // result3[i]["partnerType"] =
                                //   roomChatMemberNotCurrentUser[j].memberType;
                            }

                            //   if (
                            //     result3[i].roomChatId ===
                            //       roomChatMemberNotCurrentUser[j].roomChatId &&
                            //     roomChatMemberNotCurrentUser[j]["EndUserInfos.id"]
                            //   ) {
                            //     result3[i]["partnerId"] = null;
                            //     result3[i]["partnerEmail"] =
                            //       roomChatMemberNotCurrentUser[j]["EndUserInfos.email"] ||
                            //       roomChatMemberNotCurrentUser[j]["EndUserInfos.phoneNumber"];
                            //     result3[i]["partnerFullname"] =
                            //       roomChatMemberNotCurrentUser[j]["EndUserInfos.fullName"];
                            //     result3[i]["partnerPhone"] =
                            //       roomChatMemberNotCurrentUser[j]["EndUserInfos.phoneNumber"];
                            //     // result3[i]["partnerType"] =
                            //     //   roomChatMemberNotCurrentUser[j].memberType;
                            //   }
                        }
                    }

                    //   result3 = result3.filter((e) => e["partnerType"]);
                    if (result3.length < count) {
                        count = result3.length;
                    }

                    // this part for sort
                    if ((field, sort)) {
                        if (fields[field] === fields['receiver']) {
                            result3.sort((a, b) => {
                                if (sort === sorts['DESC']) {
                                    if (a.partnerEmail > b.partnerEmail) {
                                        return -1;
                                    }
                                    if (a.partnerEmail < b.partnerEmail) {
                                        return 1;
                                    }
                                    return 0;
                                } else {
                                    if (a.partnerEmail > b.partnerEmail) {
                                        return 1;
                                    }
                                    if (a.partnerEmail < b.partnerEmail) {
                                        return -1;
                                    }
                                    return 0;
                                }
                            });
                        }
                        if (fields[field] === fields['message']) {
                            result3.sort((a, b) => {
                                const createdAtA = new Date(a.createdAt);
                                const createdAtB = new Date(b.createdAt);
                                if (sort === sorts['DESC']) {
                                    if (createdAtA > createdAtB) {
                                        return -1;
                                    }
                                    if (createdAtA < createdAtB) {
                                        return 1;
                                    }
                                    return 0;
                                } else {
                                    if (createdAtA > createdAtB) {
                                        return 1;
                                    }
                                    if (createdAtA < createdAtB) {
                                        return -1;
                                    }
                                    return 0;
                                }
                            });
                        }
                        // if (fields[field] === fields["type"]) {
                        //   result3.sort((a, b) => {
                        //     if (sort === sorts["DESC"]) {
                        //       if (a.partnerType > b.partnerType) {
                        //         return -1;
                        //       }
                        //       if (a.partnerType < b.partnerType) {
                        //         return 1;
                        //       }
                        //       return 0;
                        //     } else {
                        //       if (a.partnerType > b.partnerType) {
                        //         return 1;
                        //       }
                        //       if (a.partnerType < b.partnerType) {
                        //         return -1;
                        //       }
                        //       return 0;
                        //     }
                        //   });
                        // }
                    }

                    finalResult = result3;
                });
            })
            .catch((error) => {
                errorMessage = error.message;
            });

        if (finalResult) {
            return ReS(
                res,
                {
                    message: 'Danh sách chat của user là',
                    data: finalResult,
                    count: count
                },
                200
            );
        } else {
            if (errorMessage) {
                return ReS(
                    res,
                    {
                        message: errorMessage,
                        data: [],
                        count: 0
                    },
                    200
                );
            }
            return ReS(
                res,
                {
                    message: 'Danh sách chat của user rỗng',
                    data: [],
                    count: 0
                },
                200
            );
        }
    } catch (err) {
        next(err);
    }
}

const fields = {
    receiver: 'receiver',
    message: 'message'
    //   type: "type",
};

const sorts = {
    DESC: 'DESC',
    ASC: 'ASC'
};
