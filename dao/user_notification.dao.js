import moment, { now } from 'moment';
import { UserNotification, Notification, User, UserAppointment } from '../models';
import { Op, or } from 'sequelize';

export const createUserNotificationRelationship = async (notification_id, user_id) => {
    try {
        await UserNotification.create({
            notification_id: notification_id,
            user_id: user_id
        });
    } catch (error) {
        throw new Error(`${error}, traceback createUserNotificationRelationship function at user_notification.dao.js file`);
    }
};

export const getUsersIDFromNotificationID = async (notification_id) => {
    try {
        const data = await UserNotification.findAll({
            where: {
                notification_id: notification_id
            },
            attributes: ['user_id']
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback getUsersFromNotificationID function at user_notification.dao.js file`);
    }
};

export const deteleAllUserNotificationRelationship = async (notification_id) => {
    try {
        await UserNotification.destroy({
            where: {
                notification_id: notification_id
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback deteleAllUserNotification function at user_notification.dao.js file`);
    }
};

export const getNotificationIDFromUsersID = async (user_id) => {
    try {
        const data = await UserNotification.findAll({
            where: {
                user_id: user_id
            },
            include: [
                {
                    model: Notification,
                    as: 'notification',
                    where: {
                        is_deleted: false
                    },
                    include: [
                        {
                            model: User,
                            as: 'created_user',
                        }
                    ]
                },
                // {
                //     model: User,
                //     as: 'user',
                //     exclude: ['createdAt', 'updatedAt', 'password']
                // }
            ]
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback getNotificationIDFromUsersID()`);
    }
};

export const getTypeNotificationIDFromUsersID = async (user_id, type) => {
    try {
        const non_appointment = await UserNotification.findAll({
            where: {
                user_id: user_id,
            },
            include: [
                {
                    model: Notification,
                    as: 'notification',
                    where: {
                        type_of_noti: type,
                        is_deleted: false,
                        title: {
                            [Op.notLike]: ('Chấp nhận lịch hẹn'||'Approved Appointment')
                        }
                    },
                    include: [
                        {
                            model: User,
                            as: 'created_user',
                            // include: [
                            //     {
                            //         model: UserAppointment,
                            //         as: 'with_mentor',
                            //         where: {
                            //             create_by_mentee_id: user_id
                            //         }
                            //     }
                            // ]
                        }
                    ]
                },
                // {
                //     model: User,
                //     as: 'user',
                //     exclude: ['createdAt', 'updatedAt', 'password']
                // }
            ]
        });
        const data3 = await UserNotification.findAll({
            where: {
                user_id: user_id,
            },
            include: [
                {
                    model: Notification,
                    as: 'notification',
                    where: {
                        type_of_noti: type,
                        is_deleted: false,
                        title: {
                            [Op.or]: [
                                ('Chấp nhận lịch hẹn'),
                                ('Approved Appointment')
                            ]
                        }
                    },
                    include: [
                        {
                            model: User,
                            as: 'created_user',
                            include: [
                                {
                                    model: UserAppointment,
                                    as: 'with_mentor',
                                    where: {
                                        create_by_mentee_id: user_id,
                                        date: {
                                            [Op.gte]: now()
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                // {
                //     model: User,
                //     as: 'user',
                //     exclude: ['createdAt', 'updatedAt', 'password']
                // }
            ]
        });
        // console.log(data3[0].dataValues.notification.dataValues.created_user.dataValues.with_mentor);
        // console.log(data3);
        if(data3.length > 0){
            let appointment = [];
            for (let index = 0; index < data3.length; index++) {
                const sent_time_check = data3[index].dataValues.notification.dataValues.sent_time;
                // console.log(sent_time_check);
                // console.log(moment(sent_time_check));
                // console.log(moment(sent_time_check).subtract(5, 'seconds'));
                const data_temp = await UserNotification.findAll({
                    where: {
                        user_id: user_id,
                    },
                    include: [
                        {
                            model: Notification,
                            as: 'notification',
                            where: {
                                type_of_noti: type,
                                is_deleted: false,
                                title: {
                                    [Op.or]: [
                                        ('Chấp nhận lịch hẹn'),
                                        ('Approved Appointment')
                                    ]
                                },
                                sent_time: sent_time_check
                            },
                            include: [
                                {
                                    model: User,
                                    as: 'created_user',
                                    include: [
                                        {
                                            model: UserAppointment,
                                            as: 'with_mentor',
                                            where: {
                                                create_by_mentee_id: user_id,
                                                date: {
                                                    [Op.gte]: now()
                                                },
                                                createdAt: {
                                                    [Op.lte]: moment(sent_time_check),
                                                    [Op.gte]: moment(sent_time_check).subtract(5, 'seconds')
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                });
                // let ApprovedAppointmentArr = appointment.filter((value, index, array) => {
                //     console.log(value.notification.dataValues.created_user.dataValues.with_mentor);
                // })

                // console.log(data_temp);
                if (data_temp.length > 0){
                    appointment.push(data_temp);
                }
            }
            return {non_appointment, appointment};
        }
        return non_appointment;
    } catch (error) {
        throw new Error(`${error}, traceback getTypeNotificationIDFromUsersID()`);
    }
};

export const deleteNotificationWhenChangeStatus = async (created_user_id, target_user_id, type_of_connection) => {
    try {
        let data = await UserNotification.findAll({
            where: {
                user_id: target_user_id
            },
            include: [
                {
                    model: Notification,
                    as: 'notification',
                    where: {
                            created_user_id: created_user_id,
                            type_of_noti: type_of_connection,
                            is_deleted: false
                    }
                }
            ]
        });

        if (data) {
            data.forEach(async element => {
                // console.log(element.dataValues.notification.dataValues.id);
                let noti = await Notification.findOne({
                    where: {
                        id: element.dataValues.notification.dataValues.id
                    }
                })
                noti.is_deleted = true;
                noti.save()
            });
            // console.log(noti);
            // data.dataValues.notification.dataValues.is_deleted = true;
            // data.dataValues.notification.save();
            // console.log(data.dataValues.notification);
    
            return data.dataValues;
        }
        return [];
    } catch (error) {
        throw new Error(`${error}, traceback deleteNotificationWhenChangeStatus()`);
    }
};
