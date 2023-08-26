import { getTranslate } from '../../utils/translate';
import { errorCode } from '../../utils/util.helper';
import { ReE, ReS } from '../../utils/util.service';
import {
    getAllUser,
    getUserDetail,
    getUsersFillterByPagesAndByRoleID,
    lockUserByID,
    unlockUserByID,
    deleteUserByID,
    countUserByRoleId,
    countAllUser,
    getAllUserByRoleID,
    searchUsersByNameOptionsPageLimit,
    searchUsersByRoleNameEmailPhoneOptionsPageLimit,
    countAllUserByRole,
    getAllProvinces,
    getDistrictsByProvinceID,
    getWardsByDistrictID,
    updateUserInfomationsByUserID,
    findOneUser,
    getCountUsersByRoleIDAndConditions,
    getUserByRoleAndSearchForNotification
} from '../../dao/user.dao';
import {
    createUserExperience,
    deleteAllUserExperienceByUserID,
    deleteOneUserExperienceByID,
    findUserExperiencesByID,
    updateOneUserExperienceByID
} from '../../dao/user_experience.dao';
import {
    createUserEducation,
    deleteAllUserEducationByUserID,
    deleteOneUserEducationByID,
    findUserEducationByID,
    updateOneUserEducationByID
} from '../../dao/user_education.dao';
import { createUserPrize, deleteAllUserPrizeByID, deleteOneUserPrizeByID, findUserPrizeByID, updateOneUserPrizeByID } from '../../dao/user_prize.dao';
import { createUserSkill, deleteAllUserSkillByID, deleteOneUserSkillByID, findUserSkillByID, updateOneUserSkillByID } from '../../dao/user_skill.dao';
import {
    createOneUserCertificate,
    deleteAllUserCertificateByID,
    deleteOneUserCertificateByID,
    findUserCertificateByID,
    updateOneUserCeritificateByID
} from '../../dao/user_certificate.dao';
import {
    createUserExtracurricularActivities,
    deleteAllUserExtracurricularActivitiesByID,
    deleteOneUserExtracurricularActivitiesByID,
    findUserExtracurricularActivitiesByID,
    updateOneUserExtracurricularActivitiesByID
} from '../../dao/user_extracurricular_activities.dao';

import { UserConsultingField, ConsultingField } from '../../models';

import { Op } from 'sequelize';

export const createUserSubInfomation = async (req, res, next) => {
    const { language } = req.user;
    const { user_id, subInfo } = req.params;
    const subInfos = ['experience', 'education', 'prize', 'skill', 'certificate', 'extracurricular-activities'];

    if (!user_id || !subInfo) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    if (!subInfos.includes(subInfo)) return ReE(res, getTranslate('Wrong Format', language), 400, errorCode.InvalidData);

    try {
        let payload;
        const user = await findOneUser(user_id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);

        if (subInfo === 'experience') {
            if (
                !req.body.consulting_field_id ||
                !req.body.company_name ||
                !req.body.start_time ||
                !req.body.working_position ||
                req.body.until_now === undefined ||
                !req.body.job_description ||
                (req.body.until_now === false && !req.body.end_time)
            )
                return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

            const data = {
                user_id: user_id,
                consulting_field_id: req.body.consulting_field_id,
                company_name: req.body.company_name,
                start_time: req.body.start_time,
                end_time: req.body?.end_time,
                working_position: req.body.working_position,
                until_now: req.body.until_now,
                job_description: req.body.job_description
            };

            payload = await createUserExperience(data);
        }

        if (subInfo === 'education') {
            if (
                !req.body.school_name ||
                !req.body.specialized_major ||
                !req.body.start_time ||
                !req.body.scores ||
                req.body.until_now === undefined ||
                (req.body.until_now === false && !req.body.end_time)
            )
                return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

            const data = {
                user_id: user_id,
                school_name: req.body.school_name,
                specialized_major: req.body.specialized_major,
                start_time: req.body.start_time,
                end_time: req.body?.end_time,
                scores: req.body.scores * 1,
                until_now: req.body.until_now
            };

            payload = await createUserEducation(data);
        }

        if (subInfo === 'prize') {
            if (!req.body.prize || !req.body.achievements || !req.body.received_date || !req.body.describe)
                return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

            const data = {
                user_id: user_id,
                prize: req.body.prize,
                achievements: req.body.achievements,
                received_date: req.body.received_date,
                describe: req.body?.describe
            };

            payload = await createUserPrize(data);
        }

        if (subInfo === 'skill') {
            if (!req.body.skill || !req.body.describe) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

            const data = {
                user_id: user_id,
                skill: req.body.skill,
                describe: req.body.describe
            };

            payload = await createUserSkill(data);
        }

        if (subInfo === 'certificate') {
            if (!req.body.certificate || !req.body.describe || !req.body.received_date)
                return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

            const data = {
                user_id: user_id,
                certificate: req.body.certificate,
                describe: req.body.describe,
                received_date: req.body.received_date
            };

            payload = await createOneUserCertificate(data);
        }

        if (subInfo === 'extracurricular-activities') {
            if (!req.body.activity || !req.body.position || !req.body.start_time || !req.body.end_time || !req.body.describe)
                return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

            const data = {
                user_id: user_id,
                activity: req.body.activity,
                position: req.body.position,
                start_time: req.body.start_time,
                end_time: req.body?.end_time,
                describe: req.body.describe
            };

            payload = await createUserExtracurricularActivities(data);
        }

        return ReS(res, { message: 'Tạo thành công!', id: payload.id }, 200);
    } catch (error) {
        next(error);
    }
};
import { sendNotificationToFcm } from '../../lib/firebase_fcm';
import { createOneNotification, updateOneNotificationIsSent } from '../../dao/notification.dao';

export const searchUsers = async (req, res, next) => {
    const input = req.query.input;
    const role_id = req.query.role_id ?? 0;
    const { language = 'en' } = req.user;
    const page = (req.query.page - 1) * 1;
    const limit = req.query.limit * 1;

    if (!req.query.input || !req.query.page || !req.query.limit)
        return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        let users;
        if (!role_id) {
            const countedAllUser = await countAllUser();
            const pageNumber = Math.ceil(countedAllUser / limit);
            if (req.query.page > pageNumber) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

            users = await searchUsersByNameOptionsPageLimit(input, page, limit);
        } else {
            const countedAllUserByRole = await countAllUserByRole(role_id);
            const pageNumber = Math.ceil(countedAllUserByRole / limit);
            if (req.query.page > pageNumber) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

            users = await searchUsersByRoleNameEmailPhoneOptionsPageLimit(role_id, input, page, limit);
        }

        return ReS(res, { users: users }, 200);
    } catch (error) {
        next(error);
    }
};

export const searchUsersPageNumber = async (req, res, next) => {
    const limit = req.params.limit * 1;
    if (!req.params.limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const countedPage = await countAllUser();
        const pageNumber = Math.ceil(countedPage / limit);
        return ReS(res, { pages: pageNumber }, 200);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUser();

        return ReS(res, { users: users }, 200);
    } catch (error) {
        next(error);
    }
};

export const getUserDetails = async (req, res, next) => {
    const { user_id } = req.params;
    const { language = 'en' } = req.user;

    if (!user_id) {
        return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    }

    try {
        const user = await getUserDetail(user_id);

        return ReS(res, { user: user }, 200);
    } catch (error) {
        next(error);
    }
};

export const getUserByRoleForNotification = async (req, res, next) => {
    const role_id = req.query.role_id * 1;
    const page = req.query?.page * 1;
    const limit = req.query?.limit * 1;
    const search = req.query?.search;
    const is_all = req.query?.is_all === 'true' ? true : false;
    const { language = 'en' } = req.user;

    if (!role_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        let users;
        let data;
        let response = {};

        if (is_all) {
            data = await getAllUserByRoleID(role_id);
            response.users = data.rows;
            response.count = data.count;
        } else {
            if (page || limit || search) {
                let condition = { role_id: role_id };
                if (!page || !limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
                if (search)
                    condition = {
                        ...condition,
                        ...{
                            [Op.or]: [
                                {
                                    fullname: {
                                        [Op.like]: `%${search}%`
                                    }
                                },
                                {
                                    phone: {
                                        [Op.like]: `%${search}%`
                                    }
                                },
                                {
                                    email: {
                                        [Op.like]: `%${search}%`
                                    }
                                }
                            ]
                        }
                    };

                const { rows, count } = await getUserByRoleAndSearchForNotification(condition, page - 1, limit);
                response.count = count;
                response.users = rows;
            }
        }

        return ReS(res, response, 200);
    } catch (error) {
        next(error);
    }
};

export const getUsersByRole = async (req, res, next) => {
    const userActiveStatus = ['disable', 'removed', 'active'];
    const role_id = req.query.role_id * 1;

    const page = req.query?.page * 1;
    const limit = req.query?.limit * 1;
    const is_all = req.query?.is_all === 'true' ? true : false;

    const searchName = req.query?.searchName;
    const searchEmail = req.query?.searchEmail;
    const searchPhone = req.query?.searchPhone;

    const searchConsultingField = req.query?.searchConsultingField * 1;

    const startActiveDate = req.query?.startActiveDate * 1;
    const startActiveMonth = req.query?.startActiveMonth * 1;
    const startActiveYear = req.query?.startActiveYear * 1;

    const endActiveDate = req.query?.endActiveDate * 1;
    const endActiveMonth = req.query?.endActiveMonth * 1;
    const endActiveYear = req.query?.endActiveYear * 1;

    const active_status = req.query?.active_status;

    const { language = 'en' } = req.user;

    if (!role_id) {
        return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    }

    try {
        let users;
        let data;
        let response = {};
        if (is_all) {
            data = await getAllUserByRoleID(role_id);
            response.count = data.count;
        } else {
            if (page && limit) {
                const countedUserByRole = await countUserByRoleId(role_id);
                const pageNumber = Math.ceil(countedUserByRole / limit);

                if (page > pageNumber) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

                let condition = { role_id: role_id };
                let include = [
                    {
                        model: UserConsultingField,
                        as: 'user_consulting_field',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        }
                    },
                    {
                        model: ConsultingField,
                        as: 'consulting_field',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt']
                        },
                        through: {
                            attributes: []
                        }
                    }
                ];

                const arrayCondition = [];

                if (searchName || searchEmail || searchPhone) {
                    // check search fullname
                    if (searchName) {
                        if (searchName.length > 50) return ReE(res, getTranslate('Search Name Over Limit', language), 400, errorCode.CanNot);

                        const query = { fullname: { [Op.like]: `%${searchName}%` } };
                        arrayCondition.push(query);
                    }

                    // check searh email
                    if (searchEmail) {
                        if (searchEmail.length > 50) return ReE(res, getTranslate('Search Email Over Limit', language), 400, errorCode.CanNot);

                        const query = { email: { [Op.like]: `%${searchEmail}%` } };
                        arrayCondition.push(query);
                    }

                    // check search phone number
                    if (searchPhone) {
                        if (searchPhone.length > 10) return ReE(res, getTranslate('Search Phone Over Limit', language), 400, errorCode.CanNot);

                        const query = { phone: { [Op.like]: `%${searchPhone}%` } };
                        arrayCondition.push(query);
                    }

                    condition = { ...condition, ...{ [Op.and]: arrayCondition } };
                }

                if (active_status !== undefined) {
                    if (!userActiveStatus.includes(active_status)) return ReE(res, getTranslate('Wrong Format', language), 403);
                    switch (active_status) {
                        case 'disable':
                            condition = { ...condition, ...{ is_active: false, is_removed: false } };
                            break;
                        case 'active':
                            condition = { ...condition, ...{ is_active: true, is_removed: false } };
                            break;
                        case 'removed':
                            condition = { ...condition, ...{ is_removed: true } };
                            break;
                        default:
                            break;
                    }
                }

                if (searchConsultingField) include[0] = { ...include[0], ...{ where: { consulting_field_id: searchConsultingField * 1 } } };

                if (startActiveDate || startActiveMonth || startActiveYear || endActiveDate || endActiveMonth || endActiveYear) {
                    if (!startActiveDate || !startActiveMonth || !startActiveYear || !endActiveDate || !endActiveMonth || !endActiveYear)
                        return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

                    condition = {
                        ...condition,
                        ...{
                            activeDay: {
                                [Op.and]: {
                                    [Op.gte]: new Date(startActiveYear, startActiveMonth - 1, startActiveDate, 0, 0, 0),
                                    [Op.lte]: new Date(endActiveYear, endActiveMonth - 1, endActiveDate, 23, 59, 59)
                                }
                            }
                        }
                    };
                }

                users = await getUsersFillterByPagesAndByRoleID(condition, include, page, limit);
                response.count = await getCountUsersByRoleIDAndConditions(condition, include);
            }
        }
        response.users = data ? data.rows : users;

        return ReS(res, response, 200);
    } catch (error) {
        next(error);
    }
};

export const lockUser = async (req, res, next) => {
    const { user_id, action } = req.query;
    const { language = 'en', id } = req.user;
    const lock_reason = req.body.lock_reason;

    if (!user_id || !action) return ReE(res, getTranslate('Missing Data Field', 'en'), 400, errorCode.DataNull);

    try {
        const user = await getUserDetail(user_id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);

        if (action === 'lock') {
            if (!user.is_active) return ReE(res, getTranslate('Can Not Perform This Action', language), 403, errorCode.Forbidden);
            if (!lock_reason) return ReE(res, getTranslate('Missing Lock Reason', language), 400, errorCode.DataNull);

            await lockUserByID(user_id, lock_reason);

            const notification = await createOneNotification(
                'Tài khoản bị khoá',
                'Bạn đã bị khoá tài khoản, vui lòng liên hệ với admin để mở khoá',
                '',
                id,
                'Admin'
            );

            await updateOneNotificationIsSent(notification.id);
            await sendNotificationToFcm(notification, user_id);
        }

        if (action === 'unlock') {
            if (user.is_active) return ReE(res, getTranslate('Can Not Perform This Action', language), 403, errorCode.Forbidden);

            await unlockUserByID(user_id);
        }

        return ReS(res, { message: `${action} user thành công!` }, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const { user_id } = req.params;
    const { language } = req.user;
    try {
        if (!user_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await getUserDetail(user_id);
        if (!user) return ReE(res, getTranslate('Account Does Not Exist', language), 404, errorCode.Exist);

        await deleteUserByID(user_id);

        return ReS(res, { message: `Xóa thành công user với id: ${user_id}` }, 200);
    } catch (error) {
        next(error);
    }
};

export const getUserByRolePageNumber = async (req, res, next) => {
    const role_id = req.query.role_id;
    const limit = req.query.limit * 1;
    const { language } = req.user;
    if (!role_id || !req.query.limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const countedUser = await countUserByRoleId(role_id);
        const pageNumber = Math.ceil(countedUser / limit);
        return ReS(res, { pages: pageNumber }, 200);
    } catch (error) {
        next(error);
    }
};

export const getCountAllUserByRole = async (req, res, next) => {
    const { role_id } = req.params;
    const { language } = req.user;
    if (!role_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const count = await countUserByRoleId(role_id);

        return ReS(res, { count: count }, 200);
    } catch (error) {
        next(error);
    }
};

export const getProvinces = async (req, res, next) => {
    const { language } = req.user;
    try {
        const provinces = await getAllProvinces();

        return ReS(res, { provinces: provinces }, 200);
    } catch (error) {
        next(error);
    }
};

export const getDistricts = async (req, res, next) => {
    const { language } = req.user;
    const province_id = req.params.province_id * 1;

    if (!req.params.province_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const districts = await getDistrictsByProvinceID(province_id);

        return ReS(res, { districts: districts }, 200);
    } catch (error) {
        next(error);
    }
};

export const getWards = async (req, res, next) => {
    const { language } = req.user;
    const district_id = req.params.district_id;

    if (!req.params.district_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const wards = await getWardsByDistrictID(district_id);

        return ReS(res, { wards: wards }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserInfomations = async (req, res, next) => {
    const { language } = req.user;
    const id = req.params.id * 1;

    const fullname = req.body?.fullname;
    const birthdayDate = req.body?.birthdayDate * 1;
    const birthdayMonth = req.body?.birthdayMonth * 1;
    const birthdayYear = req.body?.birthdayYear * 1;
    const ward_id = req.body?.ward_id * 1;
    const gender = req.body?.gender === true ? true : false;
    const phone = req.body.phone;
    const introduce_yourself = req.body?.introduce_yourself;

    if (!req.params.id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);

        const data = {};

        if (req.body.fullname) data.fullname = fullname;
        if (req.body.birthdayDate && req.body.birthdayMonth && req.body.birthdayYear)
            data.birthday = new Date(birthdayYear, birthdayMonth - 1, birthdayDate);
        else return ReE(res, getTranslate('Wrong Format', language), 400, errorCode.Exception);
        if (req.body.ward_id) data.ward_id = ward_id;
        if (req.body.gender !== undefined) data.gender = gender;
        if (req.body.phone) {
            if (req.body.phone.length > 10) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            data.phone = phone;
        }
        if (req.body.introduce_yourself) {
            if (req.body.introduce_yourself.length > 150) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            data.introduce_yourself = introduce_yourself;
        }

        await updateUserInfomationsByUserID(id, data);

        return ReS(res, { message: 'Update Thành Công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserExperience = async (req, res, next) => {
    const { language } = req.user;

    const id = req.params.id * 1;
    const experience_id = req.params.experience_id * 1;

    const consulting_field_id = req.body?.consulting_field_id ? req.body.consulting_field_id * 1 : 0;
    const working_position = req.body?.working_position;
    const company_name = req.body?.company_name;
    const job_description = req.body?.job_description;
    const start_time = req.body?.start_time;
    const until_now = req.body?.until_now === true ? true : false;
    const end_time = until_now ? new Date().toString() : req.body?.end_time;

    const updateclause = {};

    try {
        if (!req.params.id || !req.params.experience_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        const user_experience = await findUserExperiencesByID(experience_id);
        if (!user_experience) return ReE(res, getTranslate('Can Not Find User Experience', language), 404, errorCode.NotFound);

        if (working_position) {
            if (working_position.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.working_position = working_position;
        }
        if (company_name) {
            if (company_name.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.company_name = company_name;
        }
        if (job_description) {
            if (job_description.length > 255) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.job_description = job_description;
        }
        if (consulting_field_id) updateclause.consulting_field_id = consulting_field_id;
        if (start_time) updateclause.start_time = start_time;
        if (req.body.until_now !== undefined) updateclause.until_now = until_now;
        if (end_time) updateclause.end_time = end_time;

        await updateOneUserExperienceByID(experience_id, updateclause);

        return ReS(res, { message: 'Update thành công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserEducation = async (req, res, next) => {
    const { language } = req.user;

    const id = req.params.id * 1;
    const education_id = req.params.education_id * 1;

    const scores = req.body?.scores * 1;
    const school_name = req.body?.school_name;
    const specialized_major = req.body?.specialized_major;
    const start_time = req.body?.start_time;
    const until_now = req.body?.until_now === true ? true : false;
    const end_time = until_now ? new Date().toString() : req.body?.end_time;

    const updateclause = {};

    try {
        if (!req.params.id || !req.params.education_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        const user_education = await findUserEducationByID(education_id);
        if (!user_education) return ReE(res, getTranslate('Can Not Find User Education', language), 404, errorCode.NotFound);

        if (scores) {
            if (scores.toString().length > 5) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.scores = scores;
        }
        if (school_name) {
            if (school_name.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.school_name = school_name;
        }
        if (specialized_major) {
            if (specialized_major.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.specialized_major = specialized_major;
        }
        if (start_time) updateclause.start_time = start_time;
        if (req.body.until_now !== undefined) updateclause.until_now = until_now;
        if (end_time) updateclause.end_time = end_time;

        await updateOneUserEducationByID(education_id, updateclause);

        return ReS(res, { message: 'Update thành công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserPrize = async (req, res, next) => {
    const { language } = req.user;

    const id = req.params.id * 1;
    const prize_id = req.params.prize_id * 1;

    const prize = req.body?.prize;
    const achievements = req.body?.achievements;
    const received_date = req.body?.received_date ?? undefined;
    const describe = req.body?.describe ?? undefined;

    const updateclause = {};

    try {
        if (!req.params.id || !req.params.prize_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        const user_prize = await findUserPrizeByID(prize_id);
        if (!user_prize) return ReE(res, getTranslate('Can Not Find User Prize', language), 404, errorCode.NotFound);

        if (prize) {
            if (prize.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.prize = prize;
        }
        if (achievements) {
            if (achievements.length > 255) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.achievements = achievements;
        }
        if (received_date) updateclause.received_date = received_date;
        if (describe) updateclause.describe = describe;

        await updateOneUserPrizeByID(prize_id, updateclause);

        return ReS(res, { message: 'Update thành công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserSkill = async (req, res, next) => {
    const { language } = req.user;

    const id = req.params.id * 1;
    const skill_id = req.params.skill_id * 1;

    const skill = req.body?.skill;
    const describe = req.body?.describe;

    const updateclause = {};

    try {
        if (!req.params.id || !req.params.skill_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        const user_skill = await findUserSkillByID(skill_id);
        if (!user_skill) return ReE(res, getTranslate('Can Not Find User Skill', language), 404, errorCode.NotFound);

        if (skill) {
            if (skill.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.skill = skill;
        }
        if (describe) {
            if (describe.length > 255) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.describe = describe;
        }

        await updateOneUserSkillByID(skill_id, updateclause);

        return ReS(res, { message: 'Update thành công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserCeritificate = async (req, res, next) => {
    const { language } = req.user;

    const id = req.params.id * 1;
    const certificate_id = req.params.certificate_id * 1;

    const certificate = req.body?.certificate;
    const describe = req.body?.describe;
    const received_date = req.body?.received_date ?? undefined;

    const updateclause = {};

    try {
        if (!req.params.id || !req.params.certificate_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        const user_certificate = await findUserCertificateByID(certificate_id);
        if (!user_certificate) return ReE(res, getTranslate('Can Not Find User Certificate', language), 404, errorCode.NotFound);

        if (certificate) {
            if (certificate.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.certificate = certificate;
        }
        if (describe) {
            if (describe.length > 255) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.describe = describe;
        }
        if (received_date) updateclause.received_date = received_date;

        await updateOneUserCeritificateByID(certificate_id, updateclause);

        return ReS(res, { message: 'Update thành công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateUserExtracurricularActivities = async (req, res, next) => {
    const { language } = req.user;

    const id = req.params.id * 1;
    const activities_id = req.params.activities_id * 1;

    const activity = req.body?.activity;
    const position = req.body?.position;
    const describe = req.body?.describe;
    const start_time = req.body?.start_time;
    const until_now = req.body?.until_now === true ? true : false;
    const end_time = until_now ? `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}` : req.body.end_time ?? undefined;

    const updateclause = {};

    try {
        if (!req.params.id || !req.params.activities_id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

        const user = await findOneUser(id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);
        const user_activity = await findUserExtracurricularActivitiesByID(activities_id);
        if (!user_activity) return ReE(res, getTranslate('Can Not Find User Extracurricular Activities', language), 404, errorCode.NotFound);

        if (activity) {
            if (activity.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.activity = activity;
        }
        if (position) {
            if (position.length > 50) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.position = position;
        }
        if (describe) {
            if (describe.length > 255) return ReE(res, getTranslate('Over Limit', language), 403, errorCode.Forbidden);
            updateclause.describe = describe;
        }
        if (start_time) updateclause.start_time = start_time;
        if (end_time) updateclause.end_time = end_time;

        await updateOneUserExtracurricularActivitiesByID(activities_id, updateclause);

        return ReS(res, { message: 'Update thành công' }, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteUserSubInfomation = async (req, res, next) => {
    const { language } = req.user;
    const subInfos = ['experience', 'education', 'prize', 'skill', 'certificate', 'extracurricular-activities'];
    const user_id = req.params.user_id * 1;
    const subInfo = req.params.subInfo;

    if (!req.params.user_id || !req.params.subInfo) return ReE(res, getTranslate(('Missing Data Field', language), 400, errorCode.DataNull));
    if (!subInfos.includes(subInfo)) return ReE(res, getTranslate('Wrong Format', language), 400, errorCode.InvalidData);

    let option;
    let id;
    let id_list;
    let is_all;
    if (Number.isInteger(req.body.id * 1)) {
        id = req.body.id * 1;
        option = 'single';
    } else if (Array.isArray(req.body.id_list)) {
        id_list = req.body.id_list;
        option = 'list';
    } else if (req.body.is_all === true) {
        is_all = true;
        option = 'all';
    } else return ReE(res, getTranslate('Wrong Format', language), 400, errorCode.InvalidData);

    try {
        const user = await findOneUser(user_id);
        if (!user) return ReE(res, getTranslate('Can Not Find User', language), 404, errorCode.NotFound);

        if (subInfo === 'experience') {
            if (option === 'single') {
                const user_experience = await findUserExperiencesByID(id);
                if (!user_experience) return ReE(res, getTranslate('Can Not Find User Experience', language), 404, errorCode.NotFound);

                await deleteOneUserExperienceByID(id);
            } else if (option === 'list') {
                for (const id of id_list) {
                    await deleteOneUserExperienceByID(id);
                }
            } else if (option === 'all') {
                await deleteAllUserExperienceByUserID(user_id);
            }
        }

        if (subInfo === 'education') {
            if (option === 'single') {
                const user_education = await findUserEducationByID(id);
                if (!user_education) return ReE(res, getTranslate('Can Not Find User Education', language), 404, errorCode.NotFound);

                await deleteOneUserEducationByID(id);
            } else if (option === 'list') {
                for (const id of id_list) {
                    await deleteOneUserEducationByID(id);
                }
            } else if (!req.query.id && is_all) {
                await deleteAllUserEducationByUserID(user_id);
            }
        }

        if (subInfo === 'prize') {
            if (option === 'single') {
                const user_prize = await findUserPrizeByID(id);
                if (!user_prize) return ReE(res, getTranslate('Can Not Find User Prize', language), 404, errorCode.NotFound);

                await deleteOneUserPrizeByID(id);
            } else if (option === 'list') {
                for (const id of id_list) {
                    await deleteOneUserPrizeByID(id);
                }
            } else if (option === 'all') {
                await deleteAllUserPrizeByID(user_id);
            }
        }

        if (subInfo === 'skill') {
            if (option === 'single') {
                const user_skill = await findUserSkillByID(id);
                if (!user_skill) return ReE(res, getTranslate('Can Not Find User Skill', language), 404, errorCode.NotFound);

                await deleteOneUserSkillByID(id);
            } else if (option === 'list') {
                for (const id of id_list) {
                    await deleteOneUserSkillByID(id);
                }
            } else if (option === 'all') {
                await deleteAllUserSkillByID(user_id);
            }
        }

        if (subInfo === 'certificate') {
            if (option === 'single') {
                const user_certificate = await findUserCertificateByID(id);
                if (!user_certificate) return ReE(res, getTranslate('Can Not Find User Certificate', language), 404, errorCode.NotFound);

                await deleteOneUserCertificateByID(id);
            } else if (option === 'list') {
                for (const id of id_list) {
                    await deleteOneUserCertificateByID(id);
                }
            } else if (option === 'all') {
                await deleteAllUserCertificateByID(user_id);
            }
        }

        if (subInfo === 'extracurricular-activities') {
            if (option === 'single') {
                const user_extracurricular_activities = await findUserExtracurricularActivitiesByID(id);
                if (!user_extracurricular_activities)
                    return ReE(res, getTranslate('Can Not Find User Extracurricular Activities', language), 404, errorCode.NotFound);

                await deleteOneUserExtracurricularActivitiesByID(id);
            } else if (option === 'list') {
                for (const id of id_list) {
                    await deleteOneUserExtracurricularActivitiesByID(id);
                }
            } else if (option === 'all') {
                await deleteAllUserExtracurricularActivitiesByID(user_id);
            }
        }

        return ReS(res, { message: 'Xoá thành công!' }, 200);
    } catch (error) {
        next(error);
    }
};
