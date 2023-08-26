import { promisify } from 'util';
import { sign, verify } from 'jsonwebtoken';
import AppError from '../utils/appError';
import { to, ReE, ReS } from '../utils/util.service';
import { sendMail } from '../lib/email';
import { User, Role, Config, Permission, PermissionSys, RoleType, AccountRequest, UserDeviceToken } from '../models';
import { jwt_secret, jwt_expires_in, host, port } from '../config/config';
import { errorCode } from '../utils/util.helper';
import { getTokenSMS } from '../lib/sms';
import { __ } from 'i18n';
import templateEmail from '../template/email';
import { getTranslate } from '../utils/translate';
import CONFIG from '../config/config';
import { log } from 'console';
const request = require('request');
// import CONFIG from '../config/config';
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CONFIG.google_client_id);

const createToken = (id) => {
    return sign(
        {
            id
        },
        jwt_secret,
        {
            expiresIn: jwt_expires_in
        }
    );
};

export async function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

export async function test(req, res, next) {
    try {
        [err, data] = await to(getTokenSMS());
        console.log('testtttttttttttt', data);
        res.status(200).json({
            status: 'success',
            msg: 'Test api thành công',
            data
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { username, password, tokenDevice, language = 'en' } = req.body;
        // 1) check if email and password exist
        if (!username || !password) {
            return ReE(res, 'Please provide username or password', 404, errorCode.DataNull);
        }

        // 2) check if user exist and password is correct
        // const user = await User.findOne({ where: { username: username } });
        const user = await User.findOne({
            where: { username: username }
            // include: [{
            //   model: Role,
            //   as: "role",
            // }],
        });
        if (!user) {
            return ReE(res, getTranslate('Login Failed', language), 404, errorCode.NotFound);
        }

        if (!(await user.correctPassword(password, user.password))) {
            return ReE(res, getTranslate('Login Failed', language), 401, errorCode.Incorrect);
        }

        if (user.is_removed) {
            return ReE(res, getTranslate('Account Does Not Exist', language), 401, errorCode.NotFound);
        }

        if (!user.is_active) {
            return ReE(res, getTranslate('Account Blocked', language), 401, errorCode.Block);
        }
        // if (user.role_id == 6) {
        //   return ReE(res, "User is lock", 401, errorCode.Block)
        // }
        // 3) All correct, send jwt to client
        const token = createToken(user.id);
        let fcmToken = await UserDeviceToken.findAndCountAll({
            where: {
                user_id: user.id
            }
        });
        // user.connection_count_default = CONFIG.swipe_number;

        // Remove the password from the output
        user.password = undefined;
        let data = await Role.findByPk(user.role_id, {
            include: [
                {
                    model: Permission,
                    as: 'permission',
                    // attributes: ["title", "description"]
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                    },
                    through: { attributes: [] }
                }
                // {
                //   model: PermissionSys,
                //   as: "permission_sys",
                //   where: {
                //     role_id: user.role_id
                //   },
                //   attributes: {
                //     exclude: ['createdAt', 'updatedAt']
                //   },
                // },
                // {
                //   model: RoleType,
                //   as: "role_type",
                //   attributes: {
                //     exclude: ['createdAt', 'updatedAt']
                //   },
                // }
            ],
            // include: ['permission'],
            // through: { attributes: [] },
            // attributes: ['title', 'description'],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if (tokenDevice) {
            // await initUserTokenDevice(tokenDevice, user.id);
        }
        // res.status(200).json({ status: "success", token, data: { user, }, });
        return ReS(res, { token, fcmToken, data: { user, role: data } }, 200);
    } catch (err) {
        next(err);
    }
}
// login with GOOGLE
export async function loginGoogle(req, res, next) {
    try {
        const { id_token } = req.body;
        const dataGoogle = await client.verifyIdToken({
            idToken: id_token,
            audience: CONFIG.google_client_id // Verify ID token với client ID của bạn
        });
        const payload = dataGoogle.getPayload();
        const userId = payload['sub'];
        let username = payload.email;

        // 2) check if user exist and password is correct
        const user = await User.findOne({
            where: { username: username }
        });
        // signup
        if (!user) {
            let fullname = payload.name;
            let email = payload.email;
            let language = 'vi';

            const checkUserRemoved = await User.findOne({
                where: {
                    email: email,
                    is_removed: true
                }
            });
            if (checkUserRemoved) {
                return ReE(res, getTranslate('You cannot sign up with this email! Please try other email!', language), 400, errorCode.Exception);
            }

            const userExist = await User.findOne({ where: { username: username } });
            if (userExist) {
                return ReE(res, getTranslate('Account Already Exists', language), 400, errorCode.Exist);
            }

            const user = await User.create({
                username: payload.email,
                email: payload.email,
                fullname: fullname,
                role_id: 5,
                is_active: true,
                activeDay: Date.now(),
                connection_count_default: swipe_count,
                connection_count: swipe_count
            });

            const config = await Config.findOne({
                where: {
                    title: 'CONNECTION_COUNT'
                }
            });
            let swipe_count = 0;
            if (!config) swipe_count = CONFIG.swipe_number;
            else swipe_count = config.value;

            if (!user) {
                console.log('hihi');
            } else {
                const token = createToken(user.id);
                let fcmToken = await UserDeviceToken.findAndCountAll({
                    where: {
                        user_id: user.id
                    }
                });
                let data = await Role.findByPk(user.role_id, {
                    include: [
                        {
                            model: Permission,
                            as: 'permission',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                            },
                            through: { attributes: [] }
                        }
                    ],

                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                });
                return ReS(res, { token, fcmToken, data: { user, role: data } }, 200);
            }

            //xác nhận thành công, có thể login bằng tài khoản.
        }
        // login
        else {
            if (user.is_removed) {
                return ReE(res, getTranslate('Account Does Not Exist', language), 401, errorCode.NotFound);
            }

            if (!user.is_active) {
                return ReE(res, getTranslate('Account Blocked', language), 401, errorCode.Block);
            }

            // 3) All correct, send jwt to client
            const token = createToken(user.id);
            let fcmToken = await UserDeviceToken.findAndCountAll({
                where: {
                    user_id: user.id
                }
            });
            let data = await Role.findByPk(user.role_id, {
                include: [
                    {
                        model: Permission,
                        as: 'permission',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                        },
                        through: { attributes: [] }
                    }
                ],

                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            return ReS(res, { token, fcmToken, data: { user, role: data } }, 200);
        }
    } catch (err) {
        next(err);
    }
}

export async function loginFacebook(req, res, next) {
    try {
        const userToken = req.body.id_token;

        const apifb = `https://graph.facebook.com/me?fields=name,email&access_token=${userToken}`;
        request(apifb, async function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body); // Print the google web page.

                const jsondata = JSON.parse(body); // console.log(body.json()[email])
                console.log(jsondata.email);
                // jsondata.email
                const user = await User.findOne({
                    where: { email: jsondata.email }
                    // include: [{
                    //   model: Role,
                    //   as: "role",
                    // }],
                });
                if (user) {
                    if (user.is_removed) {
                        return ReE(res, getTranslate('Account Does Not Exist', language), 401, errorCode.NotFound);
                    }

                    if (!user.is_active) {
                        return ReE(res, getTranslate('Account Blocked', language), 401, errorCode.Block);
                    }
                    // if (user.role_id == 6) {
                    //   return ReE(res, "User is lock", 401, errorCode.Block)
                    // }
                    // 3) All correct, send jwt to client
                    const token = createToken(user.id);
                    let fcmToken = await UserDeviceToken.findAndCountAll({
                        where: {
                            user_id: user.id
                        }
                    });
                    // user.connection_count_default = CONFIG.swipe_number;

                    // Remove the password from the output
                    user.password = undefined;
                    let data = await Role.findByPk(user.role_id, {
                        include: [
                            {
                                model: Permission,
                                as: 'permission',
                                // attributes: ["title", "description"]
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                                },
                                through: { attributes: [] }
                            }
                        ],

                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    });

                    // res.status(200).json({ status: "success", token, data: { user, }, });
                    return ReS(res, { token, fcmToken, data: { user, role: data } }, 200);
                } else {
                    const config = await Config.findOne({
                        where: {
                            title: 'CONNECTION_COUNT'
                        }
                    });
                    let swipe_count = 0;
                    if (!config) swipe_count = CONFIG.swipe_number;
                    else swipe_count = config.value;
                    // const data = await AccountRequest.findOne({
                    //     where: {
                    //         username: username,
                    //         code_otp_confirm: code_otp
                    //     }
                    // });

                    const user = await User.create({
                        username: jsondata.email,
                        email: jsondata.email,
                        fullname: null,
                        // password: data.password,
                        // language: data.language,
                        role_id: 5,
                        is_active: true,
                        activeDay: Date.now(),
                        connection_count_default: swipe_count,
                        connection_count: swipe_count
                    });

                    // data.confirmed = true;
                    // data.active_day = Date.now();
                    // data.save();
                    //xác nhận thành công, có thể login bằng tài khoản.
                    return ReS(res, { token, fcmToken, data: { user, data: user } }, 200);
                }
            }
        });
    } catch (err) {
        next(err);
    }
}

export async function signup(req, res, next) {
    try {
        // tạo mã code
        let code = makeid(15);
        let codeOtp = makeOtp(6);
        let username, user, link;
        const { email, password, passwordConfirm, fullname, language } = req.body;

        if (!email) {
            return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
        }

        const checkUserRemoved = await User.findOne({
            where: {
                email: email,
                is_removed: true
            }
        });
        if (checkUserRemoved) {
            return ReE(res, getTranslate('You cannot sign up with this email! Please try other email!', language), 400, errorCode.Exception);
        }

        username = req.body.email;

        if (password != passwordConfirm) {
            return ReE(res, getTranslate('Incorrect Data', language), 400, errorCode.InvalidData);
        }

        const userExist = await User.findOne({ where: { username: username } });
        if (userExist) {
            return ReE(res, getTranslate('Account Already Exists', language), 400, errorCode.Exist);
        }

        await AccountRequest.destroy({
            where: { username: username }
        });

        user = await AccountRequest.create({
            username: username,
            email: email,
            fullname: fullname,
            confirmed: false,
            password: password,
            codeconfirm: code,
            code_otp_confirm: codeOtp,
            // role_id: 5,
            language: language
        });

        // const token = createToken(user.id);
        // user.password = undefined;

        // tài khoản free - email đăng ký - và link active
        link = host + ':' + port + '/api/v1/users/confirm/' + user.username + '/' + code;
        // let err = {};
        let callFunc = templateEmail[`ContentActiveAccount_${language}`];
        let [err, da] = await to(
            sendMail({
                to: user.email,
                // from: {
                //     name: "CoCo",
                //     address: 'coco@crosstechhub.com',
                // },
                // from: 'CoCo <coco@crosstechhub.com>',
                subject: __({ phrase: 'Subject Active Account', locale: language }),
                body: eval(callFunc)(user.fullname, link, codeOtp)
            })
        );
        if (err) return ReE(res, err, 200, 1000);

        return ReS(
            res,
            {
                message: getTranslate('Email Sent Successfully', language)
            },
            200
        );
    } catch (err) {
        // return ReE(res, err, 200, 1000)
        next(err);
    }
}

export async function sendBackOtpSignup(req, res, next) {
    try {
        // tạo mã code
        let code = makeid(15);
        let codeOtp = makeOtp(6);
        let username, link;
        const { email, fullname, language } = req.body;

        if (!email) {
            return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
        }
        username = req.body.email;

        let user = await AccountRequest.findOne({
            where: {
                email: email,
                confirmed: false,
                fullname: fullname
            }
        });

        if (!user) {
            return ReE(res, getTranslate('Invalid Data', language), 400, errorCode.Exist);
        }

        user.codeconfirm = code;
        user.code_otp_confirm = codeOtp;
        user.save();
        // user.password = undefined;

        // tài khoản free - email đăng ký - và link active
        link = host + ':' + port + '/api/v1/users/confirm/' + user.username + '/' + code;
        let err = {},
            da;
        let callFunc = templateEmail[`ContentActiveAccount_${language}`];
        [err, da] = await to(
            sendMail({
                to: user.email,
                // from: 'Coco <conmeocon3600@zohomail.com>',
                subject: __({ phrase: 'Subject Active Account', locale: language }),
                body: eval(callFunc)(user.fullname, link, codeOtp)
            })
        );
        if (err) return ReE(res, err, 200, 1000);

        return ReS(
            res,
            {
                message: 'Gửi mail thành công, vui lòng kiểm tra email'
            },
            200
        );
    } catch (err) {
        console.log('err--', err);
        next(err);
    }
}

export async function protect(req, res, next) {
    try {
        // 1) check if the token is there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
        }

        // 2) Verify token
        const decode = await promisify(verify)(token, jwt_secret);
        // console.log("decode", decode)
        // 3) check if the user is exist (not deleted)
        // const user = await User.findByPk(decode.id);
        const user = await User.findByPk(decode.id, {
            raw: true,
            nest: true,
            // include: ['role'],
            include: [
                {
                    model: Role,
                    as: 'role'
                    // attributes: ["title", "description"]
                }
            ]
            // through: { attributes: ["title","description"] },
            // attributes: ['email'],
        });
        let data = await Role.findByPk(user.role_id, {
            include: [
                {
                    model: RoleType,
                    as: 'role_type',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: Permission,
                    as: 'permission',
                    // attributes: ["title", "description"]
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                    },
                    through: { attributes: [] }
                },
                {
                    model: PermissionSys,
                    as: 'permission_sys',
                    where: {
                        role_id: user.role_id
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        data = JSON.parse(JSON.stringify(data, null, 4));

        if (!user) {
            return next(new AppError(401, 'fail', 'This user is no longer exist'), req, res, next);
        }

        req.user = user;
        req.role_permission = data;
        next();
    } catch (err) {
        next(err);
    }
}

// Authorization check if the user have rights to do this action
export function restrictTo(...roles) {
    return (req, res, next) => {
        // console.log("restrictTo-------------------------", req.user)

        if (!roles.includes(req.user.role.name)) {
            return next(new AppError(403, 'fail', 'You are not allowed to do this action'), req, res, next);
        }
        next();
    };
}

// Authorization check if the user have rights to do this action
export function restrictToSys(...arrPermissionSys) {
    return (req, res, next) => {
        let lenghtPerrmission = Object.keys(arrPermissionSys[0]).length;
        if (lenghtPerrmission == 0) {
            next();
        } else {
            let passPermissionSys = false;
            for (const [key, values] of Object.entries(arrPermissionSys[0])) {
                // console.log(`permission_system- ${key}: ${values}`);
                let code = key;
                let value = values;
                let obj = req.role_permission.permission_sys.find((o) => o.code === code);
                if (obj[value] == true || obj[value] == 'true') {
                    passPermissionSys = true;
                    return next();
                }
            }
            if (passPermissionSys == false) return next(new AppError(403, 'fail', 'You are not allowed to do this action'), req, res, next);
            else next();
        }
    };
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

function makeOtp(length) {
    var result = [];
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}
