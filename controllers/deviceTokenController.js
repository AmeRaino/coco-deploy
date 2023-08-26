import { getTranslate } from '../utils/translate';
import { ReE, ReS } from '../utils/util.service';
import { errorCode } from '../utils/util.helper';
import { createToken, getAllFcmTokenByUserID, updateTokenFrequencyAndExpire, updateToken, deleteTokenById, unactivateToken, deleteOneFcmTokenByToken } from '../dao/user_device_token.dao';
import moment from 'moment';

export const createFcmToken = async (req, res, next) => {
    try {
        const userID = req.user.id;
        const fcmToken = req.body.fcm_token;

        if (!fcmToken) {
            return ReE(res, getTranslate('Please generate token for your device!', req.user.language), 400, errorCode.DataNull);
        } else {
            const tokenList = await getAllFcmTokenByUserID(userID);
            let create;
            let check = true;
            const dateNow = moment(Date.now()).format('YYYY-MM-DD');
            // console.log((tokenList.rows));
            tokenList.rows.forEach(element => {
                // console.log(element.dataValues);
                if(element.dataValues.fcm_token === fcmToken){
                    // console.log(element.dataValues);
                    if (1 != element.dataValues.frequency_id){
                        // console.log(element.dataValues.frequency_id);
                        element.dataValues.frequency_id = 1;
                        updateTokenFrequencyAndExpire(element.dataValues.id);
                        // console.log(element.dataValues.frequency_id);
                    }
                    check = false;
                }
                if(element.dataValues.expire === dateNow){
                    deleteTokenById(userID, element.dataValues.id);
                }
            });

            if (check) {
                // create = 1;
                // console.log('hiiii');
                create = await createToken(userID, fcmToken);
            }
            if (create) {
                return ReS(res, { create, message: getTranslate('Create Data Success', req.user.language) }, 200);
            }
            else return ReE(res, getTranslate('Create Data Fail', req.user.language), 400, errorCode.Exception);
        }
    } catch (error) {
        // console.log('error', error);
        next(error);
    }
};

export const updateFcmToken = async (req, res, next) => {
    try {
        const userID = req.user.id;
        const tokenID = req.params.token_id;
        const fcmToken = req.body.fcm_token;
        
        if (!fcmToken) {
            return ReE(res, getTranslate('Please generate token for your device!', req.user.language), 400, errorCode.DataNull);
        } else {
            const update = await updateToken(userID, tokenID, fcmToken);

            if(update){
                return ReS(res, { update, message: getTranslate('Update Data Success', req.user.language) }, 200);
            }
            else return ReE(res, getTranslate('Update Data Fail', req.user.language), 400, errorCode.Exception);
           
            // console.log(userID);
            // const data = await UserDeviceToken.findAndCountAll({
            //     where: {
            //         [Op.and]: [
            //             {
            //                 user_id: userID
            //             },
            //             {
            //                 is_deleted: false
            //             }
            //         ]
            //     }
            // });
            // if (!data) {
            //     return ReE(res, 'User not found', 404, errorCode.NotFound);
            // } else {
            //     // console.log(data);
            //     (data.rows).forEach(element => {
            //         // console.log(element.dataValues);
            //         element.dataValues.fcm_token = fcmToken;
            //     });
            //     // data.fcm_token = fcmToken;
            //     let check = await (data.rows).save();
            //     if (check) {
            //         return ReS(res, { message: 'Update fcm token for user successfully!' }, 200);
            //     }
            // }
        }
    } catch (error) {
        // console.log('error', error);
        next(error);
    }
};

// export const updateFcmTokenWithTokenID = async (req, res, next) => {
//     try {
//         const tokenID = req.params.id;
//         const fcmToken = req.body.fcm_token;
//         const data = await UserDeviceToken.findByPk(tokenID );
//         if (!data){
//             return ReE(res, 'Token not found', 404, errorCode.NotFound);
//         }
//         else {
//             data.fcm_token = fcmToken;
//             data.save();
//         }

//         return ReS(res, { message: 'Update Fcm Token successfully' }, 200);
//     } catch (error) {
//         console.log('error',error);
//         next(error);
//     }
// }

export const unactivateFcmToken = async (req, res, next) => {
    try {
        const userID = req.user.id;
        const tokenID = req.params.token_id;
        
        const data = await unactivateToken(userID, tokenID);

        if(data){
            return ReS(res, { data, message: getTranslate('Update Data Success', req.user.language) }, 200);
        }
        else return ReE(res, getTranslate('Update Data Fail', req.user.language), 400, errorCode.Exception);
    } catch (error) {
        // console.log('error', error);
        next(error);
    }
};

export const deleteFcmTokenById = async (req, res, next) => {
    try {
        const userID = req.user.id;
        const tokenID = req.params.token_id;

        const data = await deleteTokenById(userID, tokenID);

       if(data){
            return ReS(res, { data, message: getTranslate('Delete Data Success', req.user.language) }, 200);
        }
        else return ReE(res, getTranslate('Delete Data Fail', req.user.language), 400, errorCode.Exception);
    } catch (error) {
        // console.log('error', error);
        next(error);
    }
};

export const deleteFcmTokenByToken = async (req, res, next) => {
    try {
        const fcm_token = req.body.fcm_token;

        if (!fcm_token) {
            return ReE(res, getTranslate('Please generate token for your device!', req.user.language), 400, errorCode.DataNull);
        } else {
            const data = await deleteOneFcmTokenByToken(fcm_token);
    
            if(data){
                return ReS(res, { data, message: getTranslate('Delete Data Success', req.user.language) }, 200);
            }
            else return ReE(res, getTranslate('Delete Data Fail', req.user.language), 400, errorCode.Exception);
        }
    } catch (error) {
        next(error);
    }
};
