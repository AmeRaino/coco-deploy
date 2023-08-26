import { User, MentorRegistration, MentorRegistrationConsultingField, ConsultingField, UserDeviceToken, UserConsultingField } from '../models';
import { Op } from 'sequelize';
export const isNewRegistration = async (registration_id) => {
    try {
        const newRegistration = await MentorRegistration.findOne({
            where: {
                id: registration_id,
                status_id: 1
            }
        });

        if (newRegistration) return true;
        else return false;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback isNewRegistration function at mentor_registration.dao.js`);
    }
};

export const getMentorRegistrationByID = async (id) => {
    try {
        const request = await MentorRegistration.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: ConsultingField,
                    as: 'consulting_field',
                    through: {
                        attributes: []
                    }
                }
            ]
        });

        return request;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getRequestMentorByID at mentor_registration.dao.js`);
    }
};

export const approveMentorRegistration = async (user_id, reason_register) => {
    try {
        await MentorRegistration.update(
            {
                status_id: 2
            },
            {
                where: { create_by_user_id: user_id }
            }
        );

        await User.update(
            {
                role_id: 4,
                reason_register: reason_register
            },
            {
                where: {
                    id: user_id
                }
            }
        );
    } catch (error) {
        throw new Error(`Error: ${error}, traceback approveMentorRegistration at mentor_registration.dao.js`);
    }
};

export const rejectMentorRegistration = async (user_id) => {
    try {
        await MentorRegistration.update(
            {
                status_id: 3
            },
            {
                where: { create_by_user_id: user_id }
            }
        );
    } catch (error) {
        throw new Error(`Error: ${error}, traceback rejectMentorRegistration at mentor_registration.dao.js`);
    }
};

export const getAllNewMentorRegistrationByPage = async (page, limit) => {
    try {
        const newRequests = await MentorRegistration.findAll({
            include: [
                { model: User, as: 'create_by_user', attributes: { exclude: ['createdAt', 'updatedAt', 'password'] } },
                { model: ConsultingField, as: 'consulting_field', attributes: { exclude: ['createdAt', 'updatedAt'] }, through: { attributes: [] } }
            ],
            attributes: {
                exclude: ['updatedAt']
            },
            offset: page * limit,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });

        return newRequests;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getAllWNewMentorRegistration at mentor_registration.dao.js`);
    }
};

export const getAllNewMentorRegistrationByPageFilterWithCondition = async (page, limit, condition, include) => {
    try {
        const newRequests = await MentorRegistration.findAll({
            where: condition,
            include: include,
            attributes: {
                exclude: ['updatedAt']
            },
            offset: page * limit,
            limit: limit
        });

        return newRequests;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback getAllNewMentorRegistrationByPageFilterWithCondition at mentor_registration.dao.js`);
    }
};

export const countAllNewMentorRegistrationFilterWithCondition = async (condition, include) => {
    try {
        const { rows, count } = await MentorRegistration.findAndCountAll({
            where: condition,
            include: include,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            distinct: true
        });

        return count;
    } catch (error) {
        throw new Error(`Error: ${error}, traceback countAllNewMentorRegistrationFilterWithCondition at mentor_registration.dao.js`);
    }
};

export async function createMentorRegistration(userIdCreate, reasonRegister, consultingFieldId) {
    try {
        const result = await MentorRegistration.create({
            create_by_user_id: userIdCreate,
            reason_register: reasonRegister
        });
        consultingFieldId.forEach((element) => {
            MentorRegistrationConsultingField.create({
                mentor_registration_id: result.id,
                consulting_field_id: element
            });
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createMentorRegistration()`);
    }
}

export async function findOneMentorRegistrationWithStatus(userId, statusId) {
    try {
        const result = await MentorRegistration.findOne({
            where: {
                create_by_user_id: userId,
                status_id: statusId
            }
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneMentorRegistrationWithStatus()`);
    }
}

export const countAllNewMentorRegistration = async () => {
    try {
        const data = await MentorRegistration.findAndCountAll({
            where: {
                status_id: 1
            }
        });
        return data.count;
    } catch (error) {
        throw new Error(`${error}, traceback countAllNewMentorRegistration function at mentor_registration.dao.js file`);
    }
};

export const countAllMentorRegistration = async () => {
    try {
        const data = await MentorRegistration.findAndCountAll();
        return data.count;
    } catch (error) {
        throw new Error(`${error}, traceback countAllMentorRegistration function at mentor_registration.dao.js file`);
    }
};

export const getAllNewMentorRegistration = async () => {
    try {
        const data = await MentorRegistration.findAll({
            include: [
                {
                    model: User,
                    as: 'create_by_user',
                    include: {
                        model: UserDeviceToken,
                        as: 'user_device_token',
                        attributes: ['fcm_token']
                    },
                    attributes: ['id', 'fullname', 'username', 'email']
                }
            ]
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback getAllNewMentorRegistration function at mentor_registration.dao.js file`);
    }
};

export const addConsultingfieldToUser = async (user_id, consulting_field_id) => {
    try {
        await UserConsultingField.create({
            user_id: user_id,
            consulting_field_id: consulting_field_id
        });
    } catch (error) {
        throw new Error(`${error}, traceback addConsultingfieldToUser function at mentor_registration.dao.js file`);
    }
};
