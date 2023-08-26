import { ReE, ReS } from '../utils/util.service';
import { UserConnection, User, Notification } from '../models';
import { errorCode } from '../utils/util.helper';
import { Op } from 'sequelize';
import { __ } from 'i18n';
import { findOneRandomUser, findAllUser } from '../dao/user.dao';
import { findOneRandomUserConnectionRefused } from '../dao/user_connection.dao';
import { acceptRequestNotification, refuseRequestNotification, sendRequestNotification } from '../lib/firebase_fcm';
import { createUserNotificationRelationship, deleteNotificationWhenChangeStatus } from '../dao/user_notification.dao';
import { updateOneNotificationIsSent } from '../dao/notification.dao';
import { getTranslate } from '../utils/translate';

export async function getUserConnection(req, res, next) {
    try {
        console.log('1111---', req.user.id);
        const userConnectionExist = await UserConnection.findAll({
            where: {
                [Op.or]: [
                    {
                        created_by_user_id: req.user.id
                    },
                    {
                        [Op.and]: [
                            {
                                connected: true
                            },
                            {
                                connected_user_id: req.user.id
                            }
                        ]
                    }
                ]
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id']
            }
        });
        // userConnectionExist.forEach((element) => {
        //     console.log(element.dataValues);
        // });
        let arrUserId = userConnectionExist?.map((item) => {
            if (item.connected) {
                // console.log(item.dataValues, 'hiiiiii');
                return item.created_by_user_id == req.user.id ? item.connected_user_id : item.created_by_user_id;
            }
            return item.connected_user_id;
        });
        arrUserId.push(req.user.id);

        let data = await findOneRandomUser(arrUserId);
        // console.log(data.dataValues);
        // data.forEach(element => {
        //     console.log(element.dataValues);
        // })

        if (!data) {
            // console.log('hellooooo');
            // const user = await findOneRandomUserConnectionRefused(req.user.id);
            // console.log(user);
            // if (user) {
            //     return ReS(
            //         res,
            //         {
            //             // arrUserId,
            //             data: user.connected_user
            //         },
            //         200
            //     );
            // } else {
            //     return ReS(
            //         res,
            //         {
            //             data: {}
            //         },
            //         200
            //     );
            // }
            return ReS(res, { data: {}, message: getTranslate('You are out of connection today!', req.user.language) }, 211);
        }
        return ReS(
            res,
            {
                // arrUserId,
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
export async function checkUserConnection(req, res, next) {
    try {
        const user_connected = await UserConnection.findOne({
            where: {
                created_by_user_id: req.user.id,
                connected_user_id: req.params.id
                // connection_request: false,
                // connected: true
            }
        });
        if (user_connected) {
            return ReS(
                res,
                {
                    data: user_connected,
                    message: 'thành công'
                },
                200
            );
        }
        return ReS(
            res,
            {
                data: null,
                message: 'chưa kết nối'
            },
            200
        );
    } catch (err) {
        console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

export async function checkFullConnection(req, res, next) {
    try {
        const countUser= await User.findAndCountAll({
            where: {
                [Op.and]: [
                    {
                        role_id: {
                            [Op.in]: [4, 5]
                        }
                    },
                    {
                        is_removed: false
                    },
                    {
                        id: {[Op.notIn] :[ req.user.id]}
                    }
                ]
            }
        })

      
        const {count, row} = await UserConnection.findAndCountAll({
            where: {
                created_by_user_id: req.user.id,
                // connected_user_id: req.params.id
                // connection_request: false,
                // connected: true
            }
        });

        console.log(countUser.count , count, req.user.id);
     return ReS(
                res,
                {
                    data: countUser.count===count,
                    message: 'kiểm tra thành công'
                },
                200
            );
       
    } catch (err) {
        console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

export async function acceptConnection(req, res, next) {
    try {
        const userConnectionExist = await UserConnection.findOne({
            where: {
                connected_user_id: req.user.id,
                created_by_user_id: req.params.id
                // connected: false
            }
        });
        if (userConnectionExist) {
            userConnectionExist.connected = true;
            userConnectionExist.connection_request = false;
            userConnectionExist.save();

            const receivedUser = await User.findOne({
                where: {
                    id: req.params.id
                }
            });
            console.log(receivedUser.language);

            //delete request noti
            await deleteNotificationWhenChangeStatus(req.params.id, req.user.id, 'CONNECTION');

            //push noti
            const date = new Date(Date.now() + 7 * (60 * 60 * 1000));
            await acceptRequestNotification(req.params.id, req.user.id, 'connection', receivedUser.language, date);

            // const noti = await Notification.create({
            //     title: 'Bạn đã được chấp nhận yêu cầu kết nối!',
            //     description: '',
            //     created_user_id: req.user.id,
            //     type_of_noti: 'Connection'
            // });
            // await updateOneNotificationIsSent(noti.dataValues.id);

            // await createUserNotificationRelationship(noti.dataValues.id, req.params.id);

            return ReS(
                res,
                {
                    message: 'Đã chấp nhận kết nối'
                },
                200
            );
        } else {
            return ReE(res, 'Không tìm thấy yêu cầu kết nối', 404, errorCode.NotFound);
        }
    } catch (err) {
        console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}
export async function getUserConnectionVer2(req, res, next) {
    try {
        const max = req.params.max;
        const arr = ([] = req.body.arr);
        const userConnectionExist = await UserConnection.findAll({
            where: {
                [Op.or]: [
                    {
                        created_by_user_id: req.user.id
                    },
                    {
                        [Op.and]: [
                            {
                                connected: true
                            },
                            {
                                connected_user_id: req.user.id
                            }
                        ]
                    }
                ]
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id']
            }
        });
        // add nhung user co trong bang UserConnection vao mang
        let arrUserId = userConnectionExist?.map((item) => {
            if (item.connected === true || item.connection_request === true) {
                console.log(item.connected_user_id);
                return item.connected_user_id;
            }
        });
        arrUserId.push(req.user.id);
        arrUserId.push(...arr);
        let newArrUserId = arrUserId.filter((item) => item !== undefined);
        console.log(newArrUserId);
        // tim kiem tat cac user trong bang ngoai tru cac user arrUserId
        let allUser = await findAllUser(newArrUserId);

        let datauser = [];
        for (let index = 0; index < (allUser.length = max); index++) {
            if (allUser[index]) {
                datauser.push(allUser[index]);
            }
        }
        return ReS(
            res,
            {
                datauser
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
export async function refusedConnection(req, res, next) {
    try {
        const userConnectionExist = await UserConnection.findOne({
            where: {
                connected_user_id: req.user.id,
                created_by_user_id: req.params.id
                // connection_request: false,
                // connected: false
            }
        });
        if (userConnectionExist) {
            userConnectionExist.connected = false;
            userConnectionExist.connection_request = false;
            userConnectionExist.updatedAt = new Date(Date.now() + 7 * (60 * 60 * 1000));
            userConnectionExist.save();

            const receivedUser = await User.findOne({
                where: {
                    id: req.params.id
                }
            });
            console.log(receivedUser.language);

            //push noti
            const date = new Date(Date.now() + 7 * (60 * 60 * 1000));
            await refuseRequestNotification(req.params.id, req.user.id, 'connection', receivedUser.language, date);

            // const noti = await Notification.create({
            //     title: 'Bạn bị từ chối yêu cầu kết nối!',
            //     description: '',
            //     created_user_id: req.user.id,
            //     type_of_noti: 'Connection'
            // });
            // await updateOneNotificationIsSent(noti.dataValues.id);

            // await createUserNotificationRelationship(noti.dataValues.id, req.params.id);

            return ReS(
                res,
                {
                    message: 'Đã kết nối'
                },
                200
            );
        } else {
            return ReE(res, 'Không tìm thấy yêu cầu kết nối', 404, errorCode.NotFound);
        }
    } catch (err) {
        console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

// export async function acceptConnection(req, res, next) {
//     try {
//         const userConnectionExist = await UserConnection.findOne({
//             where: {
//                 connected_user_id: req.user.id,
//                 created_by_user_id: req.params.id
//                 // connected: false
//             }
//         });
//         if (userConnectionExist) {
//             userConnectionExist.connected = true;
//             userConnectionExist.connection_request = false;
//             userConnectionExist.save();

//             const receivedUser = await User.findOne({
//                 where: {
//                     id: req.params.id
//                 }
//             });
//             console.log(receivedUser.language);

//             //delete request noti
//             await deleteNotificationWhenChangeStatus(req.params.id, req.user.id, 'CONNECTION');

//             //push noti
//             const date = new Date(Date.now() + 7 * (60 * 60 * 1000));
//             await acceptRequestNotification(req.params.id, req.user.id, 'connection', receivedUser.language, date);

//             // const noti = await Notification.create({
//             //     title: 'Bạn đã được chấp nhận yêu cầu kết nối!',
//             //     description: '',
//             //     created_user_id: req.user.id,
//             //     type_of_noti: 'Connection'
//             // });
//             // await updateOneNotificationIsSent(noti.dataValues.id);

//             // await createUserNotificationRelationship(noti.dataValues.id, req.params.id);

//             return ReS(
//                 res,
//                 {
//                     message: 'Đã chấp nhận kết nối'
//                 },
//                 200
//             );
//         } else {
//             return ReE(res, 'Không tìm thấy yêu cầu kết nối', 404, errorCode.NotFound);
//         }
//     } catch (err) {
//         console.log('err--', err);
//         // return ReE(res, err, 200, 1000)
//         next(err);
//     }
// }

export async function connectionRequest(req, res, next) {
    try {
        const createdUser = await User.findOne({
            where: {
                id: req.user.id
            }
        });
        // createdUser.connection_count = createdUser.connection_count_default;
        // createdUser.save();
        const userConnectionExist = await UserConnection.findOne({
            // tìm có chưa
            where: {
                created_by_user_id: req.user.id,
                connected_user_id: req.params.id
                // connection_request: true,
                // connected: false
            }
        });
        if (userConnectionExist) {
            // có rồi thì kiểm tra đã yêu cầu chưa
            if (userConnectionExist.connection_request == false) {
                userConnectionExist.connection_request = true;
                userConnectionExist.updatedAt = new Date(Date.now() + 7 * (60 * 60 * 1000));
                userConnectionExist.save();
            }
        } else {
            if (createdUser.connection_count > 0) {
                // chưa có thì tạo
                await UserConnection.create({
                    created_by_user_id: req.user.id,
                    connected_user_id: req.params.id,
                    connection_request: true,
                    updatedAt: new Date(Date.now() + 7 * (60 * 60 * 1000))
                    // connection_request: false,
                    // connected: false
                });

                createdUser.connection_count -= 1;
                createdUser.save();

                const receivedUser = await User.findOne({
                    where: {
                        id: req.params.id
                    }
                });
                console.log(receivedUser.language);

                //push noti
                const date = new Date(Date.now() + 7 * (60 * 60 * 1000));
                await sendRequestNotification(req.params.id, req.user.id, 'connection', receivedUser.language, date);

                // const noti = await Notification.create({
                //     title: 'Bạn vừa nhận được một yêu cầu kết nối mới',
                //     description: '',
                //     created_user_id: req.user.id,
                //     type_of_noti: 'Connection'
                // });
                // await updateOneNotificationIsSent(noti.dataValues.id);

                // await createUserNotificationRelationship(noti.dataValues.id, req.params.id);
            } else {
                return ReS(res, { data: {}, message: getTranslate('You are out of connection today!', req.user.language) }, 211);
            }
        }
        return ReS(
            res,
            {
                message: 'Đã yêu cầu kết nối'
            },
            200
        );
    } catch (err) {
        // console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

export async function removeConnectionRequest(req, res, next) {
    try {
        const userConnectionExist = await UserConnection.findOne({
            where: {
                created_by_user_id: req.user.id,
                connected_user_id: req.params.id
                // connected: false
            }
        });
        if (userConnectionExist) {
            if (userConnectionExist.connection_request == true) {
                userConnectionExist.connection_request = false;
                userConnectionExist.save();
            }
        } else {
            await UserConnection.create({
                created_by_user_id: req.user.id,
                connected_user_id: req.params.id,
                connection_request: false
            });
        }
        return ReS(
            res,
            {
                message: 'Đã loại bỏ yêu cầu kết nối'
            },
            200
        );
    } catch (err) {
        console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

export async function getConnectionRequest(req, res, next) {
    try {
        const data = await UserConnection.findAll({
            where: {
                connection_request: true,
                connected_user_id: req.user.id
            },
            include: [
                {
                    model: User,
                    as: 'created_by_user',
                    attributes: ['fullname', 'avatar', 'gender']
                }
            ],
            order: [['id', 'DESC']]
            // attributes: {
            //     exclude: ['createdAt', 'id']
            // }
        });
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export const getAllConnection = async (req, res, next) => {
    try {
        const data = await UserConnection.findAndCountAll({
            where: {
                connected: true
            },
            include: [
                {
                    model: User,
                    as: 'created_by_user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password']
                    }
                },
                {
                    model: User,
                    as: 'connected_user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'DESC']]
        });
        return ReS(res, { data, message: 'Get Data Successfully' }, 200);
    } catch (error) {
        next(error);
    }
};
