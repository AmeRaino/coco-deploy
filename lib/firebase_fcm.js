import { deleteOneFcmTokenByToken, getAllFcmTokenByUserID } from '../dao/user_device_token.dao';
import admin from 'firebase-admin';
import { Notification, User } from '../models';
import { updateOneNotificationIsSent } from '../dao/notification.dao';
import { createUserNotificationRelationship } from '../dao/user_notification.dao';
import { getTranslate } from '../utils/translate';

export const sendNotificationToFcm = async (notification, users) => {
    try {
        const list = await getUsersFcmTokens(users);
        if (list.length > 500) {
            for (const chunkList of sliceTokenList(list, 500)) {
                const message = {
                    tokens: chunkList,
                    notification: {
                        title: notification.title,
                        body: notification.description
                    }
                };

                admin
                    .messaging()
                    .sendMulticast(message)
                    .then(async (response) => {
                        if (response.failureCount > 0) {
                            const failureTokens = [];
                            response.responses.forEach(async (resp, index) => {
                                if (!resp.success) {
                                    if (resp.error.code === 'messaging/registration-token-not-registered')
                                        await deleteOneFcmTokenByToken(message.tokens[index]);
                                    failureTokens.push({ token: message.tokens[index], error: resp.error.code });
                                }
                            });
                            console.log(`List of tokens that caused failure: ${failureTokens}`);
                        }
                    })
                    .catch((error) => {
                        throw new Error(`fcm error: ${error}`);
                    });
            }
        } else if (1 < list.length <= 500) {
            const message = {
                tokens: list,
                notification: {
                    title: notification.title,
                    body: notification.description
                }
            };

            admin
                .messaging()
                .sendMulticast(message)
                .then(async (response) => {
                    if (response.failureCount > 0) {
                        const failureTokens = [];
                        response.responses.forEach(async (resp, index) => {
                            if (!resp.success) {
                                if (resp.error.code === 'messaging/registration-token-not-registered')
                                    await deleteOneFcmTokenByToken(message.tokens[index]);
                                failureTokens.push({ token: message.tokens[index], error: resp.error.code });
                            }
                        });
                        console.log(`List of tokens that caused failure: ${failureTokens}`);
                    }
                })
                .catch((error) => {
                    throw new Error(`fcm error: ${error}`);
                });
        } else if (list.length <= 1) {
            const message = {
                token: list[0],
                notification: {
                    title: notification.title,
                    body: notification.description
                }
            };

            admin
                .messaging()
                .send(message)
                .then(async (respone) => {
                    console.log(`Successfully sent message: ${respone}`);
                })
                .catch((error) => {
                    throw new Error(`fcm error: ${error}`);
                });
        }
    } catch (error) {
        throw new Error(`${error}, traceback sendNotificationToFcm function at schedule.js`);
    }
};

const sliceTokenList = (array, size) => {
    const res = [];
    for (let i = 0; i < array.length; i += size) {
        const result = array.slice(i, i + size);
        res.push(result);
    }
    return res;
};

export const sendRequestNotification = async (user_id, created_by_user_id, purpose, language, date) => {
    try {
        const fcmToken = await getUsersFcmTokens([user_id]);
        console.log(fcmToken);
        if (fcmToken.length <= 1) {
            let message = {};
            purpose === 'connection'
                ? language == 'vi'
                    ? (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Yêu cầu kết nối',
                              body: 'Bạn vừa nhận được một yêu cầu kết nối mới!'
                          }
                      })
                    : (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Request Connection',
                              body: 'New connection request now!'
                          }
                      })
                : language == 'vi'
                ? (message = {
                      token: fcmToken[0],
                      notification: {
                          title: 'Yêu cầu lịch hẹn',
                          body: 'Bạn vừa nhận được một yêu cầu đặt lịch hẹn mới!'
                      }
                  })
                : (message = {
                      token: fcmToken[0],
                      notification: {
                          title: 'Request Appointment',
                          body: 'New appointment request now!'
                      }
                  });

            console.log(message);
            if (message.token == undefined) {
                console.log(getTranslate('Cannot send notification', language));
                return getTranslate('Cannot send notification', language);
            } else {
                admin
                    .messaging()
                    .send(message)
                    .then(async (response) => {
                        console.log(`Successfully sent message: ${response}`);
                        const noti = await Notification.create({
                            // title: 'Bạn vừa nhận được một yêu cầu kết nối mới',
                            title: message.notification.title,
                            description: message.notification.body,
                            content: ``,
                            created_user_id: created_by_user_id,
                            type_of_noti: 'CONNECT',
                            sub_type_of_noti: 'CONNECT_REQUEST',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        });
                        await updateOneNotificationIsSent(noti.dataValues.id);

                        await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    })
                    .catch((error) => {
                        console.log(error);
                        // throw new Error(`fcm error: ${error}`);
                    });
            }
        } else {
            let message = {};
            purpose === 'connection'
                ? language == 'vi'
                    ? (message = {
                          tokens: fcmToken,
                          notification: {
                              title: 'Yêu cầu kết nối',
                              body: 'Bạn vừa nhận được một yêu cầu kết nối mới!'
                          }
                      })
                    : (message = {
                          tokens: fcmToken,
                          notification: {
                              title: 'Request Connection',
                              body: 'New connection request now!'
                          }
                      })
                : language == 'vi'
                ? (message = {
                      tokens: fcmToken,
                      notification: {
                          title: 'Yêu cầu lịch hẹn',
                          body: 'Bạn vừa nhận được một yêu cầu đặt lịch hẹn mới!'
                      }
                  })
                : (message = {
                      tokens: fcmToken,
                      notification: {
                          title: 'Request Appointment',
                          body: 'New appointment request now!'
                      }
                  });

            admin
                .messaging()
                .sendMulticast(message)
                .then(async (response) => {
                    if (response.failureCount > 0) {
                        const failureTokens = [];
                        response.responses.forEach(async (resp, index) => {
                            if (!resp.success) {
                                if (resp.error.code === 'messaging/registration-token-not-registered')
                                    await deleteOneFcmTokenByToken(message.tokens[index]);
                                failureTokens.push({ token: message.tokens[index], error: resp.error.code });
                            }
                        });
                        console.log(`List of tokens that caused failure: ${failureTokens}`);
                    } else {
                        const noti = await Notification.create({
                            // title: 'Bạn vừa nhận được một yêu cầu kết nối mới',
                            title: message.notification.title,
                            description: message.notification.body,
                            content: ``,
                            created_user_id: created_by_user_id,
                            type_of_noti: 'CONNECT',
                            sub_type_of_noti: 'CONNECT_REQUEST',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        });
                        await updateOneNotificationIsSent(noti.dataValues.id);

                        await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    // throw new Error(`fcm error: ${error}`);
                });
        }

        // return sendNotificationToFcm(message, user_id);
    } catch (error) {
        throw new Error(`${error}, traceback sendRequestNotification()`);
    }
};


export const sendNotificationAndSave = async (user_id, language, date, course,created_by_user_id) => {
    try {
        const fcmToken = await getUsersFcmTokens([user_id]);
        console.log(fcmToken);
        if (fcmToken.length <=1) {
            let message = {};
                language == 'vi'
                    ? (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Thông báo khóa học mới',
                              body: `Khóa học ${course} sắp khai giảng. Số lượng có hạn. Đăng ký ngay!`
                          }
                      })
                    : (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Request Connection',
                              body: `The ${course} course is about to start. Limited. Sign up now`
                          }
                      })

            if (message.token == undefined) {
                console.log(getTranslate('Cannot send notification', language));
                return getTranslate('Cannot send notification', language);
            } else {
                admin
                    .messaging()
                    .send(message)
                    .then(async (response) => {
                        console.log(`Successfully sent message: ${response}`);
                        const noti = await Notification.create({
                            // title: 'Bạn vừa nhận được một yêu cầu kết nối mới',
                            title: message.notification.title,
                            description: message.notification.body,
                            content: ``,
                            created_user_id: created_by_user_id,
                            type_of_noti: 'EDUCATION',
                            sub_type_of_noti: 'SUGGEST_COURSE',
                            year: new Date().getFullYear(),
                            month: new Date().getMonth(),
                            date: new Date().getDate(),
                            hour: new Date().getHours(),
                            minute: new Date().getMinutes()
                        });
                        await updateOneNotificationIsSent(noti.dataValues.id);

                        await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    })
                    .catch((error) => {
                        console.log(error);
                        // throw new Error(`fcm error: ${error}`);
                    });
            }
        } 

        // return sendNotificationToFcm(message, user_id);
    } catch (error) {
        throw new Error(`${error}, traceback sendRequestNotification()`);
    }
};


export const refuseRequestNotification = async (user_id, created_by_user_id, purpose, language, date) => {
    try {
        const fcmToken = await getUsersFcmTokens([user_id]);
        if (fcmToken.length <= 1) {
            let message = {};
            purpose === 'connection'
                ? language == 'vi'
                    ? (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Từ chối kết nối',
                              body: 'Bạn bị từ chối yêu cầu kết nối! :('
                          }
                      })
                    : (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Refused Connection',
                              body: 'Your connection request has been refused! :('
                          }
                      })
                : language == 'vi'
                ? (message = {
                      token: fcmToken[0],
                      notification: {
                          title: 'Từ chối lịch hẹn',
                          body: 'Bạn bị từ chối một lịch hẹn mới! :('
                      }
                  })
                : (message = {
                      token: fcmToken[0],
                      notification: {
                          title: 'Refused Appointment',
                          body: 'Your appointment request has been refused! :('
                      }
                  });
            if (message.token == undefined) {
                console.log(getTranslate('Cannot send notification', language));
                return getTranslate('Cannot send notification', language);
            } else {
                admin
                    .messaging()
                    .send(message)
                    .then(async (response) => {
                        console.log(`Successfully sent message: ${response}`);
                        const noti = await Notification.create({
                            title: message.notification.title,
                            description: message.notification.body,
                            content: ``,
                            created_user_id: created_by_user_id,
                            type_of_noti: 'CONNECT',
                            sub_type_of_noti: 'CONNECT_DECLINE',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        });
                        await updateOneNotificationIsSent(noti.dataValues.id);

                        await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    })
                    .catch((error) => {
                        console.log(error);
                        // throw new Error(`fcm error: ${error}`);
                    });
            }
        } else {
            let message = {};
            purpose === 'connection'
                ? language == 'vi'
                    ? (message = {
                          tokens: fcmToken,
                          notification: {
                              title: 'Từ chối kết nối',
                              body: 'Bạn bị từ chối yêu cầu kết nối! :('
                          }
                      })
                    : (message = {
                          tokens: fcmToken,
                          notification: {
                              title: 'Refused Connection',
                              body: 'Your connection request has been refused! :('
                          }
                      })
                : language == 'vi'
                ? (message = {
                      tokens: fcmToken,
                      notification: {
                          title: 'Từ chối lịch hẹn',
                          body: 'Bạn bị từ chối một lịch hẹn mới! :('
                      }
                  })
                : (message = {
                      tokens: fcmToken,
                      notification: {
                          title: 'Refused Appointment',
                          body: 'Your appointment request has been refused! :('
                      }
                  });

            admin
                .messaging()
                .sendMulticast(message)
                .then(async (response) => {
                    if (response.failureCount > 0) {
                        const failureTokens = [];
                        response.responses.forEach(async (resp, index) => {
                            if (!resp.success) {
                                if (resp.error.code === 'messaging/registration-token-not-registered')
                                    await deleteOneFcmTokenByToken(message.tokens[index]);
                                failureTokens.push({ token: message.tokens[index], error: resp.error.code });
                            }
                        });
                        console.log(`List of tokens that caused failure: ${failureTokens}`);
                    } else {
                        const noti = await Notification.create({
                            title: message.notification.title,
                            description: message.notification.body,
                            content: ``,
                            created_user_id: created_by_user_id,
                            type_of_noti: 'CONNECT',
                            sub_type_of_noti: 'CONNECT_DECLINE',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        });
                        await updateOneNotificationIsSent(noti.dataValues.id);

                        await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    // throw new Error(`fcm error: ${error}`);
                });
        }

        // return sendSingleImmediateNotification(message, user_id);
    } catch (error) {
        throw new Error(`${error}, traceback refuseRequestNotification()`);
    }
};

export const acceptRequestNotification = async (user_id, created_by_user_id, purpose, language, date) => {
    try {
        const fcmToken = await getUsersFcmTokens([user_id]);
        if (fcmToken.length <= 1) {
            let message = {};
            purpose === 'connection'
                ? language == 'vi'
                    ? (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Chấp nhận kết nối',
                              body: 'Bạn đã được chấp nhận yêu cầu kết nối! :D'
                          }
                      })
                    : (message = {
                          token: fcmToken[0],
                          notification: {
                              title: 'Approved Connection',
                              body: 'Your connection request has been approved! :D'
                          }
                      })
                : language == 'vi'
                ? (message = {
                      token: fcmToken[0],
                      notification: {
                          title: 'Chấp nhận lịch hẹn',
                          body: 'Bạn vừa nhận được chấp nhận một lịch hẹn mới! :D'
                      }
                  })
                : (message = {
                      token: fcmToken[0],
                      notification: {
                          title: 'Approved Appointment',
                          body: 'Your appointment request has been approved! :D'
                      }
                  });
            if (message.token == undefined) {
                console.log(getTranslate('Cannot send notification', language));
                return getTranslate('Cannot send notification', language);
            } else {
                admin
                    .messaging()
                    .send(message)
                    .then(async (response) => {
                        console.log(`Successfully sent message: ${response}`);
                        const noti = await Notification.create({
                            title: message.notification.title,
                            description: message.notification.body,
                            content: ``,
                            created_user_id: created_by_user_id,
                            type_of_noti: 'CONNECT',
                            sub_type_of_noti: 'CONNECT_APPROVED',
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            date: date.getDate(),
                            hour: date.getHours(),
                            minute: date.getMinutes()
                        });
                        await updateOneNotificationIsSent(noti.dataValues.id);

                        await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    })
                    .catch((error) => {
                        console.log(error);
                        // throw new Error(`fcm error: ${error}`);
                    });
            }
        } else {
            let message = {};
            purpose === 'connection'
                ? language == 'vi'
                    ? (message = {
                          tokens: fcmToken,
                          notification: {
                              title: 'Chấp nhận kết nối',
                              body: 'Bạn đã được chấp nhận yêu cầu kết nối! :D'
                          }
                      })
                    : (message = {
                          tokens: fcmToken,
                          notification: {
                              title: 'Approved Connection',
                              body: 'Your connection request has been approved! :D'
                          }
                      })
                : language == 'vi'
                ? (message = {
                      tokens: fcmToken,
                      notification: {
                          title: 'Chấp nhận lịch hẹn',
                          body: 'Bạn vừa nhận được chấp nhận một lịch hẹn mới! :D'
                      }
                  })
                : (message = {
                      tokens: fcmToken,
                      notification: {
                          title: 'Approved Appointment',
                          body: 'Your appointment request has been approved! :D'
                      }
                  });

            admin
                .messaging()
                .sendMulticast(message)
                .then(async (response) => {
                    // if (response.failureCount > 0) {
                    //     const failureTokens = [];
                    //     response.responses.forEach(async (resp, index) => {
                    //         if (!resp.success) {
                    //             if (resp.error.code === 'messaging/registration-token-not-registered')
                    //                 await deleteOneFcmTokenByToken(message.tokens[index]);
                    //             failureTokens.push({ token: message.tokens[index], error: resp.error.code });
                    //         }
                    //     });
                    //     console.log(`List of tokens that caused failure: ${failureTokens}`);
                    // } else {
                    const noti = await Notification.create({
                        title: message.notification.title,
                        description: message.notification.body,
                        content: ``,
                        created_user_id: created_by_user_id,
                        type_of_noti: 'CONNECT',
                        sub_type_of_noti: 'CONNECT_APPROVED',
                        year: date.getFullYear(),
                        month: date.getMonth(),
                        date: date.getDate(),
                        hour: date.getHours(),
                        minute: date.getMinutes()
                    });
                    await updateOneNotificationIsSent(noti.dataValues.id);

                    await createUserNotificationRelationship(noti.dataValues.id, user_id);
                    console.log(noti);
                    // }
                })
                .catch((error) => {
                    console.log(error);
                    // throw new Error(`fcm error: ${error}`);
                });
        }

        // return sendSingleImmediateNotification(message, user_id);
    } catch (error) {
        throw new Error(`${error}, traceback acceptRequestNotification()`);
    }
};

export const sendCourseNotification = async (user_id, fullname, name_vi, name_en, created_user_id) => {
    try {
        const fcmToken = await getUsersFcmTokens([user_id]);
        // console.log(fcmToken);
        const receivedUser = await User.findOne({
            where: {
                id: user_id
            }
        });
        console.log(receivedUser);
        let language = receivedUser.language;
        let message = {};

        language == 'vi'
            ? (message = {
                  token: fcmToken[0],
                  notification: {
                      title: 'Thông báo lịch học',
                      body: `${fullname} ơi, khóa học ${name_vi} sẽ được khai giảng vào ngày mai, note ngay lịch và đừng quên tham gia buổi học nhé!`
                  }
              })
            : (message = {
                  token: fcmToken[0],
                  notification: {
                      title: 'Appointment Notification',
                      body: `${fullname}, ${name_en} course will start tomorrow, note the calendar and do not forget to join the class!`
                  }
              });

        console.log(message);
        if (message.token == undefined) {
            console.log(getTranslate('Cannot send notification', language));
            return getTranslate('Cannot send notification', language);
        } else {
            admin
                .messaging()
                .send(message)
                .then(async (response) => {
                    console.log(`Successfully sent message: ${response}`);
                    const noti = await Notification.create({
                        // title: 'Bạn vừa nhận được một yêu cầu kết nối mới',
                        title: message.notification.title,
                        description: message.notification.body,
                        content: ``,
                        created_user_id: created_user_id,
                        type_of_noti: 'EDUCATION',
                        sub_type_of_noti: 'SCHEDULE_REMINDER',
                        year: new Date().getFullYear(),
                        month: new Date().getMonth(),
                        date: new Date().getDate(),
                        hour: new Date().getHours(),
                        minute: new Date().getMinutes()
                    });
                    await updateOneNotificationIsSent(noti.dataValues.id);

                    await createUserNotificationRelationship(noti.dataValues.id, user_id);
                })
                .catch((error) => {
                    console.log(error);
                    // throw new Error(`fcm error: ${error}`);
                });
        }
    } catch (error) {
        throw new Error(`${error}, traceback sendRequestNotification()`);
    }
};

const getUsersFcmTokens = async (users) => {
    try {
        const fcmTokens = [];
        for (const user of users) {
            const userFcmTokens = await getAllFcmTokenByUserID(user);

            if (userFcmTokens.count === 1) {
                // console.log(userFcmTokens.rows[0].dataValues.fcm_token);
                fcmTokens.push(userFcmTokens.rows[0].dataValues.fcm_token);
            } else {
                for (const token of userFcmTokens.rows) {
                    // console.log(token.dataValues.fcm_token);
                    fcmTokens.push(token.dataValues.fcm_token);
                }
                // for (const token of userFcmTokens) {
                //     fcmTokens.push(token.fcm_token);
                // }
            }
            // console.log(fcmTokens);
        }

        return fcmTokens;
    } catch (error) {
        throw new Error(`${error}, traceback getUsersFcmTokens() function at firebase_fcm.js`);
    }
};
