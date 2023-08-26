import { jwt_secret, jwt_expires_in, host, port } from '../../config/config';
import { getTranslate } from '../../utils/translate';
import { errorCode } from '../../utils/util.helper';
import { ReE, ReS } from '../../utils/util.service';
import { findOneUserByUsername, findOneUser } from '../../dao/user.dao';
import { getRolePermissionsByRoleID } from '../../dao/roles.dao';
import { User, Role, Permission, RoleType, PermissionSys } from '../../models';
import { sign, verify } from 'jsonwebtoken';
import { promisify } from 'util';
import AppError from '../../utils/appError';

export const protect = async (req, res, next) => {
    const language = 'en';
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError(401, 'fail', 'You are not logged in! Please login in to continue'), req, res, next);
    }

    try {
        const decodeToken = await promisify(verify)(token, jwt_secret);
        const user = await User.findByPk(decodeToken.id, {
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            raw: true,
            nest: true
        });

        if (user.role_id !== 1) return ReE(res, getTranslate('Unauthorized', language), 401, errorCode.Forbidden);

        const roleData = await Role.findByPk(user.role_id, {
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
        const data = JSON.parse(JSON.stringify(roleData, null, 4));

        req.user = user;
        req.role_permission = data;
        next();
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { username, password, language = 'en' } = req.body;
    if (!username || !password) return ReE(res, getTranslate('Missing username or password', language), 400, errorCode.DataNull);

    try {
        const user = await findOneUserByUsername(username);

        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        if (!(await user.correctPassword(password, user.dataValues.password)))
            return ReE(res, getTranslate('Wrong Password', language), 401, errorCode.Incorrect);
        if (user.dataValues.role_id !== 1) return ReE(res, getTranslate('Unauthorized', language), 401, errorCode.CanNot);
        if (!user.dataValues.is_active) {
            return ReE(res, getTranslate('Account Blocked', language), 401, errorCode.Block);
        }

        const token = createToken(user.dataValues.id);

        const roleData = await getRolePermissionsByRoleID(user.dataValues.role_id);
        user.dataValues.password = undefined;

        return ReS(res, { token: token, data: { user: user.dataValues, role: roleData } }, 200);
    } catch (error) {
        next(error);
    }
};

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
