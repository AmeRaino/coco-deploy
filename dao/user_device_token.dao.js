import { UserDeviceToken } from '../models';
import { Op } from 'sequelize';
import moment from 'moment';

export const createToken = async (user_id, fcmToken) => {
    try {
        const date = moment(Date.now()).toDate();
        date.setMonth(date.getMonth() + 1);

        const createToken = await UserDeviceToken.create({
            user_id: user_id,
            fcm_token: fcmToken,
            is_active: true,
            frequency_id: 1,
            expire: date
        });
        return createToken;
    } catch (error) {
        throw new Error(`${error}, traceback createToken()`);
    }
};

export const getAllFcmTokenByUserID = async (user_id) => {
    try {
        const fcmTokens = await UserDeviceToken.findAndCountAll({
            where: { user_id: user_id },
            attributes: ['id', 'fcm_token', 'user_id', 'is_active', 'frequency_id', 'expire']
        });
        return fcmTokens;
    } catch (error) {
        throw new Error(`${error}, traceback getAllFcmTokenByUserID()`);
    }
};

export const deleteOneFcmTokenByToken = async (token) => {
    try {
        const del = await UserDeviceToken.destroy({
            where: {
                fcm_token: token
            }
        });
        return del;
    } catch (error) {
        throw new Error(`${error}, traceback deleteOneFcmTokenByToken()`);
    }
};

export const updateToken = async (user_id, token_id, fcm_token) => {
    try {
        const update = await UserDeviceToken.update(
            {
                fcm_token: fcm_token
            },
            {
                where: {
                    [Op.and]: [
                        {
                            id: token_id
                        },
                        {
                            user_id: user_id
                        }
                    ]
                }
            }
        );
        return update;
    } catch (error) {
        throw new Error(`${error}, traceback updateToken()`);
    }
};

export const updateTokenFrequencyAndExpire = async (token_id) => {
    try {
        const date = moment(Date.now()).toDate();
        date.setMonth(date.getMonth() + 1);

        const update = await UserDeviceToken.update(
            {
                frequency_id: 1,
                expire: date
            },
            {
                where: {
                    id: token_id
                }
            }
        );
        return update;
    } catch (error) {
        throw new Error(`${error}, traceback updateFcmTokenFrequency()`);
    }
};

export const deleteTokenById = async (user_id, token_id) => {
    try {
        // const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const del = await UserDeviceToken.destroy({
            where: {
                [Op.and]: [
                    {
                        id: token_id
                    },
                    {
                        user_id: user_id
                    }
                ]
            }
        });
        return del;
    } catch (error) {
        throw new Error(`${error}, traceback deleteFcmTokenById()`);
    }
};

export const unactivateToken = async (user_id, token_id) => {
    try {
        const unact = await UserDeviceToken.update(
            {
                is_active: false
            },
            {
                where: {
                    [Op.and]: [
                        {
                            id: token_id
                        },
                        {
                            user_id: user_id
                        }
                    ]
                }
            }
        );
        return unact;
    } catch (error) {
        throw new Error(`${error}, traceback unactivateToken()`);
    }
};
