import {
    User,
    Role,
    RoleType,
    Permission,
    PermissionSys,
    UserEducation,
    UserSkill,
    UserPrize,
    UserExtracurricularActivities,
    UserExperience,
    UserCertificate,
    ConsultingField,
    UserConsultingField,
    UserReviews,
    UserConnection,
    UserDeviceToken,
    Ward,
    Province,
    District,
    Course,
    MentorRegistration
} from '../models';
import moment from 'moment';

const { Op, col } = require('sequelize');
var Sequelize = require('sequelize');

async function findOneUser(user_id) {
    try {
        const user = await User.findOne({
            where: {
                id: user_id
            }
        });

        return user;
    } catch (error) {
        throw new Error(`${error}, traceback findOneUser()`);
    }
}

async function findOneRandomUser(arrIdNotIn) {
    try {
        const newArr = Array.from(new Set(arrIdNotIn));
        console.log(newArr.sort(), '--------');
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    {
                        id: {
                            [Op.notIn]: newArr
                        }
                    },
                    {
                        role_id: {
                            [Op.in]: [4, 5]
                        }
                    },
                    {
                        is_removed: false
                    }
                ]
            },
            include: [
                {
                    model: UserExperience,
                    as: 'user_experience',
                    attributes: ['company_name', 'start_time', 'end_time', 'working_position', 'until_now']
                }
            ],
            order: Sequelize.literal('rand()'),
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'code_otp_confirm']
            }
        });
        return user;
    } catch (error) {
        throw new Error(`${error}, traceback findOneRandomUser()`);
    }
}

async function findAllUser(arrIdNotIn) {
    try {
        const newArr = Array.from(new Set(arrIdNotIn));
        // console.log(newArr, '--------');
        const user = await User.findAll({
            where: {
                [Op.and]: [
                    {
                        id: {
                            [Op.notIn]: newArr
                        }
                    },
                    {
                        role_id: {
                            [Op.in]: [4, 5]
                        }
                    },
                    {
                        is_removed: false
                    }
                ]
            },
            include: [
                {
                    model: UserExperience,
                    as: 'user_experience',
                    attributes: ['company_name', 'start_time', 'end_time', 'working_position', 'until_now']
                }
            ],
            order: Sequelize.literal('rand()'),
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'code_otp_confirm']
            }
            // offset: 2
        });
        return user;
    } catch (error) {
        throw new Error(`${error}, traceback findAllUser()`);
    }
}

async function isUserContentRole(user_id) {
    const user = await User.findOne({
        where: {
            id: user_id
        },
        attributes: ['id'],
        include: [
            {
                model: Role,
                as: 'role',
                attributes: ['id', 'name']
            }
        ],
        raw: true
    });

    if (user['role.name'] === 'Content') {
        return true;
    } else {
        return false;
    }
}

async function isUserAnonymouse(user_id) {
    try {
        const user = await User.findOne({
            where: {
                id: user_id
            },
            attributes: ['id'],
            include: [
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id'],
                    include: [
                        {
                            model: RoleType,
                            as: 'role_type',
                            attributes: ['id', 'code']
                        }
                    ]
                }
            ],
            raw: true
        });
        console.log(user);

        if (user['role.role_type.code'] === 'anonymous') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

async function queryPermissionSysByUserId(userId) {
    try {
        const user = await User.findByPk(userId, {
            raw: true,
            nest: true,
            include: [
                {
                    model: Role,
                    as: 'role'
                }
            ]
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
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback checkPermissionSendMessage`);
    }
}

function restrictToSysChats(dataQueryPermissionSys, ...arrPermissionSys) {
    let lenghtPerrmission = Object.keys(arrPermissionSys[0]).length;
    if (lenghtPerrmission == 0) {
        return true;
    } else {
        let passPermissionSys = false;
        for (const [key, values] of Object.entries(arrPermissionSys[0])) {
            // console.log(`permission_system- ${key}: ${values}`);
            let code = key;
            let value = values;
            let obj = dataQueryPermissionSys.find((o) => o.code === code);
            if (obj) {
                if (obj[value] == true || obj[value] == 'true') {
                    passPermissionSys = true;
                    return passPermissionSys;
                }
            }
        }
        return passPermissionSys;
    }
}

async function getAllUserRoleEndUser() {
    try {
        const query = await User.findAll({
            where: {
                role_id: 6
            },
            attributes: ['id', 'email'],
            raw: true
        });

        const listUserId = [];
        query.forEach((element) => {
            listUserId.push(element.id);
        });
        return listUserId;
    } catch (error) {
        throw new Error(`${error}, traceback getAllUserRoleEndUser`);
    }
}

async function getEndUserLoginInfor(user_id) {
    try {
        const query = await User.findOne({
            where: {
                id: user_id
            },
            attributes: ['id', 'email', 'phone', 'avatar'],
            raw: true
        });
        return query;
    } catch (error) {
        throw new Error(`${error}, traceback getEndUserLoginInfor`);
    }
}

async function findAndCountAllUserByRoleAndSearch(roleId, search, amount, page, order, arrangement, filterConsultingField) {
    try {
        let { count, rows } = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        fullname: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        job: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ],
                [Op.and]: [
                    {
                        role_id: roleId
                    },
                    {
                        is_removed: 0
                    }
                ]
            },
            include: [
                {
                    model: UserReviews,
                    as: 'user_reviews',
                    attributes: ['rate']
                },
                {
                    model: UserConsultingField,
                    as: 'user_consulting_field',
                    where: filterConsultingField
                    // attributes: ["rate"]
                }
            ],
            attributes: {
                include: [[Sequelize.fn('AVG', Sequelize.col('user_reviews.rate')), 'rate']],
                exclude: ['createdAt', 'updatedAt', 'password', 'code_otp_confirm', 'role_id']
            },
            group: ['User.id'],
            subQuery: false,
            required: true,
            limit: amount * 1,
            offset: page * amount,
            order: [[order, arrangement]]
        });
        count = count.length;
        return { count, rows };
    } catch (error) {
        throw new Error(`${error}, traceback findAndCountAllUserByRoleAndSearch()`);
    }
}

export async function getUserDetail(id) {
    try {
        // const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const result = await User.findByPk(id, {
            include: [
                // {
                //     model: UserConnection,
                //     as: 'user_connection'
                // },
                {
                    model: Course,
                    as: 'course'
                },
                {
                    model: UserEducation,
                    as: 'user_education'
                },
                {
                    model: UserSkill,
                    as: 'user_skill'
                },
                {
                    model: UserPrize,
                    as: 'user_prize'
                },
                {
                    model: UserExtracurricularActivities,
                    as: 'user_extracurricular_activities'
                },
                {
                    model: UserExperience,
                    as: 'user_experience',
                    include: [
                        {
                            model: ConsultingField,
                            as: 'consulting_field'
                        }
                    ]
                },
                {
                    model: UserCertificate,
                    as: 'user_certificate'
                },
                {
                    model: ConsultingField,
                    as: 'consulting_field',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    through: { attributes: [] }
                },
                {
                    model: Ward,
                    as: 'ward',
                    include: [
                        {
                            model: District,
                            as: 'district',
                            include: [
                                {
                                    model: Province,
                                    as: 'province',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt']
                                    }
                                }
                            ],
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            }
                        }
                    ],
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: UserDeviceToken,
                    as: 'user_device_token'
                },
                {
                    model: MentorRegistration,
                    as: 'mentor_registration_create_by_user',
                    attributes: ['reason_register']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'code_otp_confirm', 'role_id']
            }
        });

        return result;
    } catch (error) {
        throw new Error(`${error}, traceback getUserDetail()`);
    }
}

const getUsersFillterByPagesAndByRoleID = async (condition, include, page, limit) => {
    try {
        const user = await User.findAll({
            where: condition,
            include: include,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'role_id']
            },
            offset: (page - 1) * limit * 1,
            limit: limit * 1
        });

        return user;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getUsersFillterByPagesAndByRoleID function at DAO folder`);
    }
};

const getUserByRoleAndSearchForNotification = async (condition, page, limit) => {
    try {
        const { rows, count } = await User.findAndCountAll({
            where: condition,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            },
            offset: page * limit,
            limit: limit
        });

        return { rows, count };
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getUserByRoleAndSearchForNotification function at DAO folder`);
    }
};

const getCountUsersByRoleIDAndConditions = async (condition, include) => {
    try {
        const { count } = await User.findAndCountAll({
            where: condition,
            include: include,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password', 'role_id']
            },
            distinct: true
        });

        return count;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getCountUsersByRoleIDAndConditions function at DAO folder`);
    }
};

const lockUserByID = async (user_id, lock_reason) => {
    try {
        await User.update(
            {
                is_active: false,
                reason_lock: lock_reason
            },
            {
                where: { id: user_id }
            }
        );
    } catch (error) {
        throw new Error(`Error: ${error}, traceback lockUser function at DAO folder`);
    }
};

const unlockUserByID = async (user_id) => {
    try {
        await User.update(
            { is_active: true },
            {
                where: { id: user_id }
            }
        );
    } catch (error) {
        throw new Error(`Error: ${error}, traceback unlockUser function at DAO folder`);
    }
};

const deleteUserByID = async (user_id) => {
    try {
        await User.destroy({
            where: { id: user_id }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteUserByID function at DAO folder`);
    }
};

const searchUsersByNameOptionsPageLimit = async (input, page, limit) => {
    try {
        const users = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        fullname: {
                            [Op.like]: `%${input}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${input}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${input}%`
                        }
                    }
                ]
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            offset: page * limit,
            limit: limit
        });

        return users;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback searchUsersByNameOptionsPageLimit function at DAO folder`);
    }
};

const searchUsersByRoleNameEmailPhoneOptionsPageLimit = async (role_id, input, page, limit) => {
    try {
        const users = await User.findAll({
            where: {
                role_id: role_id,
                [Op.or]: [
                    {
                        fullname: {
                            [Op.like]: `%${input}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${input}%`
                        }
                    },
                    {
                        phone: {
                            [Op.like]: `%${input}%`
                        }
                    }
                ]
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            offset: page * limit,
            limit: limit
        });

        return users;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback searchUsersByRoleNameEmailPhoneOptionsPageLimit function at DAO folder`);
    }
};

const getAllUser = async () => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        return users;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getAllUsers function at DAO folder`);
    }
};

const countUserByRoleId = async (role_id) => {
    try {
        const data = await User.findAndCountAll({
            where: {
                role_id: role_id
            }
        });

        return data.count;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback countUserByRoleId function at user.dao.js file`);
    }
};

const countAllUser = async () => {
    try {
        const data = await User.findAndCountAll();

        return data.count;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback countAllUser function at user.dao.js file`);
    }
};

const countAllUserByRole = async (role_id) => {
    try {
        const data = await User.findAndCountAll({
            where: {
                role_id: role_id
            }
        });

        return data.count;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback countAllUserByRole function at user.dao.js file`);
    }
};

const findOneUserByUsername = async (username) => {
    try {
        const user = await User.findOne({
            where: {
                username: username
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        return user;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findOneUserByUsername function at user.dao.js file`);
    }
};

const getAllUserByRoleID = async (role_id) => {
    try {
        const data = await User.findAndCountAll({
            where: {
                role_id: role_id
            },
            include: {
                model: ConsultingField,
                as: 'consulting_field',
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                through: { attributes: [] }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });
        return data;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getAllUserByRoleID function at user.dao.js file`);
    }
};

export const getAllProvinces = async () => {
    try {
        return await Province.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getAllProvinces function at user.dao.js file`);
    }
};

export const getDistrictsByProvinceID = async (province_id) => {
    try {
        return await District.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Province,
                    as: 'province',
                    where: {
                        id: province_id
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ]
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getDistrictsByProvinceID function at user.dao.js file`);
    }
};

export const getWardsByDistrictID = async (district_id) => {
    try {
        return await Ward.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [
                {
                    model: District,
                    as: 'district',
                    where: {
                        id: district_id
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ]
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getWardsByDistrictID function at user.dao.js file`);
    }
};

const updateUserInfomationsByUserID = async (user_id, data) => {
    try {
        await User.update(data, {
            where: {
                id: user_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback updateUserInfomationsByUserID function at user.dao.js file`);
    }
};

const getAllUsersByRoleInCludeUserToken = async (role_id) => {
    try {
        const data = await User.findAll({
            where: {
                role_id: role_id
            },
            include: [
                {
                    model: UserDeviceToken,
                    as: 'user_device_token',
                    attributes: ['fcm_token']
                }
            ],
            attributes: ['id', 'username', 'fullname', 'email']
        });

        return data;
    } catch (error) {
        throw new Error(`${error}, traceback getAllUsersByRole at user.dao.js in dao folder`);
    }
};

module.exports = {
    getAllUsersByRoleInCludeUserToken,
    updateUserInfomationsByUserID,
    getAllUserByRoleID,
    findOneUserByUsername,
    countAllUser,
    countUserByRoleId,
    getAllUser,
    getUserDetail,
    searchUsersByNameOptionsPageLimit,
    lockUserByID,
    unlockUserByID,
    deleteUserByID,
    findOneUser,
    isUserAnonymouse,
    queryPermissionSysByUserId,
    restrictToSysChats,
    isUserContentRole,
    getAllUserRoleEndUser,
    getEndUserLoginInfor,
    findAndCountAllUserByRoleAndSearch,
    findOneRandomUser,
    getUsersFillterByPagesAndByRoleID,
    countAllUserByRole,
    searchUsersByRoleNameEmailPhoneOptionsPageLimit,
    getCountUsersByRoleIDAndConditions,
    getUserByRoleAndSearchForNotification,
    findAllUser
};
