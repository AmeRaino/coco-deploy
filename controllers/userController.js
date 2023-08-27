import { to, ReE, ReS, TE } from '../utils/util.service';
import { getTranslate } from '../utils/translate';
import { User, Role, AccountRequest, Organization, UserDeviceToken, Config } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import UserConstant from '../constants/UserConstant';
import { sendMail } from '../lib/email';
import { deleteOne } from './baseController';
import { host_ui, host, port } from '../config/config';
import { Op } from 'sequelize';
import { literal, col } from 'sequelize';
import { getTokenSMS, sendSMS } from '../lib/sms';
import { __ } from 'i18n';
import templateEmail from '../template/email';
import templateSMS from '../template/sms';
import { deleteFile } from '../lib/deletefile';
import user_device_tokenModel from '../models/user_device_token.model';
import CONFIG from '../config/config';

export async function getAllUserWithFullname(req, res, next) {
    try {
        let filterOrganizationId;
        // if (req.role_permission.role_type.code == "organization") {
        filterOrganizationId = {
            organization_id: req.user.organization_id
        };
        // }
        let data = await User.findAndCountAll({
            where: filterOrganizationId,
            subQuery: false,
            attributes: ['id', 'fullname', 'username', 'email', 'phone', 'avatar'],
            order: [['fullname']]
        });
        return ReS(
            res,
            {
                count: data.count,
                data: data.rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getAllUserWithInfoAndRole(req, res, next) {
    try {
        let filterOrganizationId = undefined;
        filterOrganizationId = {
            organization_id: req.user.organization_id
        };
        let data = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        role_id: 1
                    },
                    filterOrganizationId
                ]
            },
            subQuery: false,
            attributes: ['id', 'fullname', 'username', 'email', 'phone', 'role_id'],
            order: [['fullname']]
        });
        return ReS(
            res,
            {
                count: data.count,
                data: data.rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getAllUsers(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'id', search = '', arrangement = 'ASC', organization_id, role_id, trial, status } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        } else if (order == 'organization.name' || order == 'organization.nameVi' || order == 'role.name' || order == 'role.nameVi') {
            order = literal(order);
        }
        let filterOrganizationId = undefined,
            filterRoleId = undefined,
            filterRoleType = undefined;
        let filterIsTrial = undefined,
            filterIsActive = undefined;
        if (req.role_permission.role_type.code == 'organization') {
            filterOrganizationId = {
                id: req.user.organization_id
            };
            filterRoleType = {
                role_type_id: 2
            };
        } else {
            if (organization_id) {
                filterOrganizationId = {
                    id: organization_id
                };
            }
        }
        if (role_id) {
            filterRoleId = {
                id: role_id
            };
        }
        if (trial != undefined && trial != '') {
            filterIsTrial = {
                is_trial: parseBool(trial)
            };
        }
        if (status != undefined && status != '') {
            filterIsActive = {
                is_active: parseBool(status)
            };
        }
        let data = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        fullname: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        email: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        phone: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ],
                [Op.and]: [filterIsTrial, filterIsActive]
            },
            subQuery: false,
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['name', 'nameVi', 'id'],
                    where: {
                        [Op.and]: [filterRoleId, filterRoleType]
                    }
                },
                {
                    model: Organization,
                    as: 'organization',
                    attributes: ['name', 'nameVi', 'id'],
                    where: filterOrganizationId
                },
                {
                    model: user_device_tokenModel,
                    as: 'user_device_token',
                    attributes: ['fcm_token'],
                    through: { attributes: [] }
                }
            ],
            attributes: {
                include: [
                    [col('role.name'), 'roleName'],
                    [col('organization.name'), 'organizationName']
                ],
                exclude: ['role', 'createdAt', 'updatedAt', 'password']
            },
            limit: amount * 1,
            offset: page * amount,
            order: [[order, arrangement]]
        });
        return ReS(
            res,
            {
                count: data.count,
                data: data.rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getUserCompleteAccount(req, res, next) {
    try {
        if (!req.query.username || !req.query.code) {
            return ReE(res, 'Please provide data', 404, errorCode.InvalidData);
        }
        const data = await User.findOne({
            where: {
                username: req.query.username,
                codeconfirm: req.query.code
            }
        });
        if (!data) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }
        data.password = undefined;
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

export async function getUser(req, res, next) {
    try {
        let fcmToken = await UserDeviceToken.findAndCountAll({ where: {user_id: req.params.id} });
        let data = await User.findByPk(req.params.id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });
        if (!data) {
            return ReE(res, 'User not found', 404, errorCode.NotFound);
        }
        return ReS(
            res,
            {
                data,
                fcmToken
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
export const deleteUser = deleteOne(User);

export async function createUser(req, res, next) {
    try {
        //tạo user -> Active luôn là true -> gửi mail đổi mật khẩu cho user.
        // gửi mail: Link FE - link có username + code -> FE show giao diện -> gọi api gửi username + code: BE nếu đúng thì trả về data
        // FE: đổi data với username + code.
        // nếu bữa trước là gửi link user + code là BE mà sao lần này k gửi BE? Vì bữa đó cần phải xác nhận user - xác nhận email - chỉ được xác nhận 1 lần, nên BE cần tách bạch việc xác nhận và đổi mật khẩu.
        // còn đây đã được xác nhận rồi
        // tạo mã code
        let code = makeid(15);
        let codeOtp = makeOTP(6);
        let { select_username, email, phone, role_id, organization_id, status, fullname, gender, birthday, address, trial } = req.body;
        let username, link;
        if (!select_username) {
            return ReE(res, 'Bạn thiếu select_username', 400, errorCode.DataNull);
        }
        if (!role_id) {
            return ReE(res, 'Bạn thiếu role_id', 400, errorCode.DataNull);
        }
        if (req.role_permission.role_type.code == 'organization') {
            //nếu admin tạo tài khoản thì mặc định là organization của admin
            organization_id = req.user.organization_id;
        } else if (!organization_id) {
            return ReE(res, 'Bạn thiếu organization_id', 400, errorCode.DataNull);
        }
        if (!fullname || !gender || !status) {
            return ReE(res, 'Bạn thiếu data', 400, errorCode.DataNull);
        }

        if (select_username == 'email') {
            if (!email) {
                return ReE(res, 'Bạn thiếu email', 400, errorCode.DataNull);
            }
            username = email;
        } else {
            if (!phone) {
                return ReE(res, 'Bạn thiếu phone', 400, errorCode.DataNull);
            }
            username = phone;
        }
        let dataOrganization = await Organization.findByPk(organization_id);
        let dataOrganizationName = req.user.language == 'en' ? dataOrganization.name : dataOrganization.nameVi;

        const userExist = await User.findOne({ where: { username: username } });
        if (userExist) {
            return ReE(res, 'Tài khoản đã được đăng ký', 400, errorCode.Exist);
        }

        const user = await User.create({
            username: username,
            email: email,
            phone: phone,
            select_username: select_username,
            fullname: fullname,
            gender: gender,
            birthday: birthday,
            is_active: status,
            is_trial: trial,
            address: address,
            codeconfirm: code,
            code_otp_confirm: codeOtp,
            create_by: req.user.id,
            role_id: role_id,
            organization_id: organization_id,
            language: req.user.language
        });

        if (req.body.select_username == 'email') {
            // link = CONFIG.host + ":" + CONFIG.port + '/api/v1/users/confirm/' + user.username + '/' + code
            let callFunc = templateEmail[`ContentInvitation_${req.user.language}`];
            link = host_ui + '/auth/create?username=' + user.username + '&code=' + code;
            // let checkSendMail = {},err = {};
            // [err, checkSendMail] = await to(semail.sendMail({
            to(
                sendMail({
                    to: user.email,
                    // from: 'Coco <Coco <conmeocon3600@zohomail.com>>',
                    subject: '<' + dataOrganizationName + '> ' + __({ phrase: 'Subject Invitation Email', locale: req.user.language }),
                    body: eval(callFunc)(user.fullname, dataOrganizationName, link, codeOtp)
                })
            );
            // if (err) return ReE(res, err, 200, 1000);

            return ReS(
                res,
                {
                    message: 'Gửi mail thành công, vui lòng liên hệ user kiểm tra email'
                },
                201
            );
        } else {
            // let err = {};
            let [err, dataToken] = await to(getTokenSMS());
            if (err) return ReE(res, 'Err get token send sms', 400, errorCode.Exception);
            let toPhone = user.phone;
            let link = host_ui + '/auth/create?username=' + user.username + '&code=' + code;
            let callFunc = templateSMS[`ContentInvitation_${req.user.language}`];
            let content = eval(callFunc)(user.fullname, dataOrganizationName, link, codeOtp);
            // let errSendSMS = {};
            to(
                sendSMS({
                    access_token: dataToken.access_token,
                    phone: toPhone,
                    message: content
                })
            );
            // if (errSendSMS) return ReE(res, "Err send sms", 400, contantStatus.errorCode.Exception)
            return ReS(
                res,
                {
                    message: 'Gửi sms thành công, vui lòng nhắc user kiểm tra sms'
                },
                200
            );
        }
    } catch (err) {
        console.log('err--', err);
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

export async function updateUser(req, res, next) {
    try {
        let { email, phone, role_id, organization_id, status, fullname, gender, birthday, address, trial } = req.body;
        if (!role_id) {
            return ReE(res, 'Bạn thiếu role_id', 400, errorCode.DataNull);
        }
        if (!organization_id) {
            return ReE(res, 'Bạn thiếu organization_id', 400, errorCode.DataNull);
        }
        if (!status || !fullname || !gender) {
            return ReE(res, 'Bạn thiếu data', 400, errorCode.DataNull);
        }

        const data = await User.findByPk(req.params.id);
        if (!data) {
            return ReE(res, 'User not found', 404, errorCode.NotFound);
        }
        if (isNaN(data.username)) {
            //k phải sđt, là email
            if (!email) {
                return ReE(res, 'Bạn thiếu email', 400, errorCode.DataNull);
            }
        } else {
            if (!phone) {
                return ReE(res, 'Bạn thiếu phone', 400, errorCode.DataNull);
            }
        }

        data.email = email;
        data.phone = phone;
        data.fullname = fullname;
        data.gender = gender;
        data.birthday = birthday;
        data.is_active = status;
        data.is_trial = trial;
        data.address = address;
        data.role_id = role_id;
        data.organization_id = organization_id;
        let check = await data.save();
        if (check)
            return ReS(
                res,
                {
                    message: 'update thành công'
                },
                200
            );
    } catch (err) {
        next(err);
    }
}

export async function changeStatusUser(req, res, next) {
    try {
        let data = await User.findByPk(req.params.id, {});
        if (!data) {
            return ReE(res, 'User not found', 404, errorCode.NotFound);
        }
        data.is_active = !data.is_active;
        data.save();

        return ReS(
            res,
            {
                message: 'Đổi trạng thái thành công'
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function changeNotificationUser(req, res, next) {
    try {
        let notification;
        console.log('notification===', req.user.notification);

        notification = !req.user.notification;
        console.log('notification===', notification);
        const data = await User.update({ notification: notification }, { where: { id: req.user.id } });

        if (data == false) {
            return ReE(res, 'Update không thành công', 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                data: notification,
                message: getTranslate('Change Notification Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
export async function changeLanguageUser(req, res, next) {
    try {
        let language;
        language = req.user.language == 'vi' ? 'en' : 'vi';
        const doc = await User.update({ language: language }, { where: { id: req.user.id } });

        if (doc == false) {
            return ReE(res, 'Update không thành công', 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                data: language,
                message: getTranslate('Change Language Success', language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getMyProfile(req, res, next) {
    try {
        let dataUser = req.user;
        delete dataUser.password;
        delete dataUser.role;
        return ReS(res, {
            data: dataUser
        });
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfile(req, res, next) {
    try {
        let dataUserUpdate = {
            fullname: req.body.fullname,
            gender: req.body.gender,
            address: req.body.address,
            birthday: req.body.birthday,
            phone: req.body.phone,
            email: req.body.email,
            emergency_notification: req.body.emergency_notification,
            warning_notification: req.body.warning_notification,
            operation_notification: req.body.operation_notification
        };
        const doc = await User.update(dataUserUpdate, { where: { id: req.user.id } });

        if (doc == false) {
            return ReE(res, 'Update không thành công', 404, errorCode.NotFound);
        }

        const dataAfterUpdate = await User.findByPk(req.user.id, {
            // include: [{
            //     model: Role,
            //     as: "role",
            //     attributes: ["title", "description"]
            // }],
        });
        // delete dataAfterUpdate.password
        dataAfterUpdate.password = undefined;
        // delete dataAfterUpdate.role

        return ReS(
            res,
            {
                message: 'update thành công',
                data: dataAfterUpdate
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function confirmUser(req, res, next) {
    try {
        const data = await User.findOne({
            where: {
                username: req.params.username,
                codeconfirm: req.params.code
            }
        });
        if (data) {
            data.codeconfirm = null;
            data.is_active = true;
            data.activeDay = Date.now();
            data.save();
            //xác nhận thành công, có thể login bằng tài khoản.
            res.redirect(host_ui + '/auth/login?code=' + successCode.Confimred);
            // res.status(200).json({status: 'success',data: user});
        } else {
            res.redirect(host_ui + '/auth/login?code=' + errorCode.Unconfimred);
            // res.status(200).json({ status: 'fails',data: null});
        }
    } catch (error) {
        res.redirect(host_ui + '/auth/login?code=' + errorCode.Unconfimred);
        next(error);
    }
}

export async function confirmOtpUser(req, res, next) {
    try {
        let { code_otp, username , language} = req.body;
        const config = await Config.findOne({
            where: {
                title: "CONNECTION_COUNT"
            }
        });
        let swipe_count = 0;
        if (!config) swipe_count = CONFIG.swipe_number;
        else swipe_count = config.value;
        const data = await AccountRequest.findOne({
            where: {
                username: username,
                code_otp_confirm: code_otp
            }
        });
        if (data) {
            await User.create({
                username: data.username,
                email: data.email,
                fullname: data.fullname,
                password: data.password,
                language: data.language,
                is_active: true,
                activeDay: Date.now(),
                connection_count_default: swipe_count,
                connection_count: swipe_count
            });

            data.confirmed = true;
            data.active_day = Date.now();
            data.save();
            //xác nhận thành công, có thể login bằng tài khoản.
            return ReS(
                res,
                {
                    message: getTranslate('Data Validation Success', language),
                    code: successCode.Confimred
                },
                200
            );
        } else {
            return ReE(res, getTranslate('Data Validation Failed', language), 400, errorCode.Unconfimred);
        }
    } catch (error) {
        next(error);
    }
}

export async function completeYourAccount(req, res, next) {
    try {
        let { username, code, email, phone, fullname, gender, birthday, address, password, passwordConfirm } = req.body;
        if (!username || !code || !fullname || !gender || !password || !passwordConfirm) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        } else if (password != passwordConfirm) {
            return ReE(res, 'Password không hợp lệ', 400, errorCode.InvalidData);
        }
        const data = await User.findOne({
            where: {
                username: username,
                codeconfirm: code
            }
        });
        if (!data) {
            return ReE(res, 'Invalid data', 404, errorCode.InvalidData);
        }

        if (data) {
            // data.is_active = true
            data.password = password;
            data.codeconfirm = null;
            data.email = email;
            data.phone = phone;
            data.fullname = fullname;
            data.gender = gender;
            data.birthday = birthday;
            data.address = address;
            data.save();
            //xác nhận thành công, có thể login bằng tài khoản.
            return ReS(
                res,
                {
                    code: successCode.Confimred
                },
                200
            );
        } else {
            return ReE(
                res,
                {
                    code: errorCode.Unconfimred
                },
                200
            );
        }
    } catch (error) {
        // return ReE(res, {
        //     code: contantStatus.errorCode.Unconfimred
        // }, 200);
        next(error);
    }
}

//gửi mail
export async function forgotPasswordUser(req, res, next) {
    try {
        let code, link, codeOtp;
        let language = req.query.language;
        if (!req.query.username) {
            return ReE(res, getTranslate('Please provide username!', language), 404, errorCode.InvalidData);
        }
        const data = await User.findOne({
            where: {
                username: req.query.username
            }
        });
        if (!data) {
            return ReE(res, getTranslate('Account Does Not Exist', language), 400, errorCode.NotFound);
        } else {
            if (!data.is_active) {
                return ReE(res, getTranslate('User is blocked', language), 401, errorCode.Block);
            }
            codeOtp = makeOTP(6);
            var dateNow = new Date();
            code = dateNow.getTime();
            data.codeconfirm = code;
            data.code_otp_confirm = codeOtp;
            link = host + ':' + port + '/api/v1/users/confirm-forgot-password/' + data.email + '/' + code;
            data.save();
            // if (isNaN(data.username)) { //k phải sđt, là email
            let callFunc = templateEmail[`ContentResetPassword_${data.language}`];
            to(
                sendMail({
                    to: data.email,
                    // from: 'Coco <conmeocon3600@zohomail.com>',
                    subject: __({ phrase: 'Subject Reset Password Email', locale: data.language }),
                    body: eval(callFunc)(data.fullname, link, codeOtp)
                })
            );
            // if (err) return ReE(res, err, 400, contantStatus.errorCode.Exception)
            return ReS(
                res,
                {
                    message: 'Gửi mail thành công, vui lòng kiểm tra email'
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
}

//xác nhận code mail, đổi code -> cho đổi pass
export async function confirmForgotPassword(req, res, next) {
    try {
        if (!req.params.code || !req.params.username) {
            // return ReE(res, "Bạn thiếu data", 400, contantStatus.errorCode.DataNull)
            return res.redirect(host_ui + '/auth/reset-password?code=' + errorCode.DataNull);
        }
        let code = req.params.code;
        var dateNow = new Date();
        if (code < dateNow.getTime() - 2 * 60 * 60 * 1000) {
            // return ReE(res, "Liên kết hết hạn", 400, contantStatus.errorCode.TimeOut)
            return res.redirect(host_ui + '/auth/reset-password?code=' + errorCode.TimeOut);
        }

        const data = await User.findOne({
            where: {
                username: req.params.username,
                codeconfirm: req.params.code
            }
        });

        if (data) {
            data.status = true;
            data.codeconfirm = makeid(16);
            data.save();
            // return res.status(200).json({
            //     status: 'success',
            //     data: {
            //         code: data.codeconfirm,
            //         username: data.username
            //     }
            // });
            // chuyển trang đổi mật khẩu: có username + code
            return res.redirect(
                host_ui + '/auth/reset-password?code=' + successCode.Confimred + '&username=' + data.username + '&code_confirm=' + data.codeconfirm
            );
        } else {
            return res.redirect(host_ui + '/auth/reset-password?code=' + errorCode.Unconfimred);
            // return res.status(200).json({
            //     status: 'fails',
            //     message: "Xác nhận không thành công"
            // });
        }
    } catch (error) {
        res.redirect(host_ui + '/auth/reset-password?code=' + errorCode.Unconfimred);
        next(error);
    }
}

export async function confirmOtpForgotPassword(req, res, next) {
    try {
        let { code_otp, username, language } = req.body;
        console.log('---', username, code_otp);
        if (!code_otp || !username || code_otp == '' || username == '') {
            return ReE(res, 'Bạn thiếu data', 400, errorCode.DataNull);
        }

        const data = await User.findOne({
            where: {
                username: username,
                code_otp_confirm: code_otp
            }
        });
        if (!data) {
            return ReE(res, getTranslate('Wrong Username Or OTP', language), 400, errorCode.InvalidData);
        }
        var dateNow = new Date();
        if (data.codeconfirm < dateNow.getTime() - 2 * 60 * 60 * 1000) {
            return ReE(res, getTranslate('Expired OTP', language), 400, errorCode.TimeOut);
        }

        if (data) {
            data.status = true;
            data.codeconfirm = makeid(16);
            data.save();
            return ReS(
                res,
                {
                    data: {
                        code: data.codeconfirm,
                        username: data.username
                    }
                },
                200
            );
            // chuyển trang đổi mật khẩu: có username + code
        } else {
            return ReE(res, getTranslate('Data Validation Failed', language), 404, errorCode.InvalidData);
        }
    } catch (error) {
        next(error);
    }
}

//code mới + pass + pass confirm
export async function changeForgotPassword(req, res, next) {
    try {
        const data = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (!data) {
            return ReE(res, 'User not found', 404, errorCode.NotFound);
        } else {
            if (req.body.password != req.body.passwordConfirm) {
                return ReE(res, getTranslate('Check your password again!', req.body.language), 400, errorCode.InvalidData);
            }
            // console.log("datadata", data.codeconfirm)
            // console.log("datadata", req.body.code)
            if (data.codeconfirm != null && req.body.code && data.codeconfirm == req.body.code) {
                // có gửi quên mk, có mã code gửi lên, và 2 cái giống nhau
                //cho đổi mk, xóa code
                data.password = req.body.password;
                data.codeconfirm = null;
                data.save();
                return ReS(
                    res,
                    {
                        message:  getTranslate('Update Data Success', req.body.language)
                    },
                    200
                );
            }
            return ReE(res, getTranslate('Update Data Fail', req.body.language), 404, errorCode.InvalidData);
        }
    } catch (error) {
        next(error);
    }
}

//change pass: pass mới, cũ, confirm pass
export async function changePassword(req, res, next) {
    try {
        if (!req.body.passwordConfirm || !req.body.passwordOld || !req.body.passwordNew) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        } else if (req.body.passwordConfirm != req.body.passwordNew) {
            return ReE(res, 'Password mới không hợp lệ', 400, errorCode.InvalidData);
        }
        const data = await User.findByPk(req.user.id, {
            // include: [{
            //     model: Role,
            //     as: "role",
            //     attributes: ["title", "description"]
            // }],
        });

        if (data) {
            if (!(await data.correctPassword(req.body.passwordOld, data.password))) {
                return ReE(res, getTranslate('Wrong Password', req.user.language), 401, errorCode.Incorrect);
            } else {
                data.password = req.body.passwordNew;
                data.save();
                return ReS(
                    res,
                    {
                        message: getTranslate('Update Data Success', req.user.language)
                    },
                    200
                );
            }
        }
        return ReE(res, getTranslate('Update Data Fail', req.user.language), 404, errorCode.NotFound);
    } catch (error) {
        next(error);
    }
}

export async function approveUser(req, res, next) {
    //này k sử dụng thì phải
    try {
        // const data = await AccountRequest.findOne({
        //     where:
        //     {
        //         email: req.body.email,
        //         codeconfirm: req.params.code
        //     }
        // });
        if (data) {
            data.status = 2;
            data.codeconfirm = null;
            data.save();
            // code = makeid(15)
            const user = await User.create({
                username: data.username,
                fullname: data.fullname,
                email: data.email,
                gender: data.gender,
                is_active: data.status,
                select_username: data.select_username,
                password: data.password,
                // codeconfirm: code,
                phone: data.phone,
                create_by: data.bycreate
            });
            user.password = undefined;
            //xác nhận thành công, có thể login bằng tài khoản.
            res.status(200).json({
                status: 'success',
                data: user
            });
        } else {
            res.status(200).json({
                status: 'fails',
                data: null
            });
        }
    } catch (error) {
        next(error);
    }
}

export async function uploadAvatar(req, res, next) {
    try {
        const files = req.files;
        if (!files) return ReE(res, 'Miss File', 404, errorCode.InvalidData);

        let urlAvatar, urlConnectionImage;
        const data = await User.findByPk(req.user.id);
        if (!files.avatar) {
            //nếu k có thì k cần create file name
            urlAvatar = '';
        } else {
            urlAvatar = 'public/avatars/' + files.avatar[0].filename;
        }
        if (data.dataValues.avatar) {
            deleteFile(data.dataValues.avatar);
        }
        data.avatar = urlAvatar;

        if (!files.connection_image) {
            //nếu k có thì k cần create file name
            urlConnectionImage = '';
        } else {
            urlConnectionImage = 'public/avatars/' + files.connection_image[0].filename;
        }
        if (data.dataValues.connection_image) {
            deleteFile(data.dataValues.connection_image);
        }
        data.connection_image = urlConnectionImage;
        let check = await data.save();
        if (check)
            return ReS(
                res,
                {
                    message: getTranslate('Update Data Success', req.user.language)
                },
                200
            );
    } catch (error) {
        //nếu mà k thành công thì xóa hình.
        const files = req.files;
        if (files) {
            if (files.avatar) {
                let urlLogo = 'public/avatars/' + files.avatar[0].filename;
                deleteFile(urlLogo);
            }
            if (files.connection_image) {
                let urlConnectionImage = 'public/avatars/' + files.connection_image[0].filename;
                deleteFile(urlConnectionImage);
            }
        }
        next(error);
    }
}

function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function makeOTP(length) {
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

export async function createDefaultUser() {
    const user = await User.findAll();
    if (user.length == 0) {
        for (const [key, value] of Object.entries(UserConstant)) {
            User.create(value);
        }
    }
}

var parseBool = function (str) {
    if (str == 'false') return false;
    else return true;
};

export async function verifyTokenUser(req, res, next) {
    try {
        return ReS(
            res,
            {
                message: 'Xác nhận thành công'
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

export const removeAccount = async (req, res, next) => {
    try {
        const pass = req.body.password;
        const language = req.user.language;
    
        if(!pass) {
            return ReE(res, getTranslate('Please provide your password', language), 404, errorCode.DataNull);
        }
    
        else {
            const user = await User.findOne({
                where: { username: req.user.username }
            });
            if(!(await user.correctPassword(pass, user.password))){
                return ReE(res, getTranslate('Wrong Password', language), 401, errorCode.Incorrect);
            }
    
            else {
                user.is_removed = true;
                user.save();
                return ReS(res, getTranslate('Delete Your Account Successfully'), 200);
            }
        }
    } catch (error) {
        next(error);
    }
};

export const getConnectionCount = async (req, res, next) => {
    try {
        const result = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        const data = result.connection_count;

        if(!data) {
            return ReE(res, 'User not found', 404, errorCode.NotFound);
        }
        else {
            return ReS(res, { data }, 200);
        }
    } catch (error) {
        next(error)
    }
};
