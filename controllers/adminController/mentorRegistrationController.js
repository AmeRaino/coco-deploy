import { getUserDetail } from '../../dao/user.dao';
import { getTranslate } from '../../utils/translate';
import { errorCode } from '../../utils/util.helper';
import { ReE, ReS } from '../../utils/util.service';
import {
    isNewRegistration,
    approveMentorRegistration,
    getMentorRegistrationByID,
    rejectMentorRegistration,
    getAllNewMentorRegistrationByPage,
    countAllNewMentorRegistration,
    addConsultingfieldToUser,
    getAllNewMentorRegistrationByPageFilterWithCondition,
    countAllNewMentorRegistrationFilterWithCondition,
    countAllMentorRegistration
} from '../../dao/mentor_registration.dao';
import { User, ConsultingField } from '../../models';
import { Op } from 'sequelize';

export const getMentorRegistrationsByPage = async (req, res, next) => {
    const page = req.query.page * 1 - 1;
    const limit = req.query.limit * 1;
    const { language } = req.user;
    if (!req.query.page || !req.query.limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    const search = req.query?.search;
    const searchName = req.query?.searchName;
    const searchEmail = req.query?.searchEmail;
    const searchPhone = req.query?.searchPhone;

    const searchConsultingField = req.query?.searchConsultingField * 1;

    const startDate = req.query?.startDate * 1;
    const startMonth = req.query?.startMonth * 1;
    const startYear = req.query?.startYear * 1;

    const endDate = req.query?.endDate * 1;
    const endMonth = req.query?.endMonth * 1;
    const endYear = req.query?.endYear * 1;

    const status_id = req.query?.status_id * 1;

    const is_noti = req.query?.is_noti === 'true' ? true : false;

    const payload = [];

    try {
        let registrations;
        let count;
        const countRegistations = await countAllMentorRegistration();
        const mentorRegistrationPages = Math.ceil(countRegistations / limit);
        if (req.query.page > mentorRegistrationPages) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

        if (
            is_noti ||
            search ||
            searchName ||
            searchEmail ||
            searchPhone ||
            status_id ||
            searchConsultingField ||
            startDate ||
            startMonth ||
            startYear ||
            endDate ||
            endMonth ||
            endYear
        ) {
            let condition = {};
            let include = [
                { model: User, as: 'create_by_user', attributes: { exclude: ['createdAt', 'updatedAt', 'password'] } },
                { model: ConsultingField, as: 'consulting_field', attributes: { exclude: ['createdAt', 'updatedAt'] }, through: { attributes: [] } }
            ];

            if (searchName || searchEmail || searchPhone) {
                let query = {};
                if (searchName) {
                    if (searchName.length > 50) return ReE(res, getTranslate('Search Name Over Limit', language), 400, errorCode.CanNot);

                    query = { ...query, ...{ fullname: { [Op.like]: `%${searchName}%` } } };
                }

                if (searchEmail) {
                    if (searchEmail.length > 50) return ReE(res, getTranslate('Search Email Over Limit', language), 400, errorCode.CanNot);

                    query = { ...query, ...{ email: { [Op.like]: `%${searchEmail}%` } } };
                }

                if (searchPhone) {
                    if (searchPhone.length > 11) return ReE(res, getTranslate('Search Phone Over Limit', language), 400, errorCode.CanNot);

                    query = { ...query, ...{ phone: { [Op.like]: `%${searchPhone}%` } } };
                }

                include[0] = { ...include[0], ...{ where: query } };
            }
            console.log(is_noti);

            if (is_noti || search) {
                if (!is_noti || !search) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
                const queryNoti = [
                    { fullname: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                    { phone: { [Op.like]: `%${search}%` } }
                ];
                include[0] = {
                    ...include[0],
                    ...{
                        where: {
                            [Op.or]: queryNoti
                        }
                    }
                };
            }

            if (searchConsultingField) include[1] = { ...include[1], ...{ where: { id: searchConsultingField } } };

            if (status_id) condition = { ...condition, ...{ status_id: status_id } };

            if (startDate || startMonth || startYear || endDate || endMonth || endYear) {
                if (!startDate || !startMonth || !startYear || !endDate || !endMonth || !endYear)
                    return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

                condition = {
                    ...condition,
                    ...{
                        createdAt: {
                            [Op.and]: {
                                [Op.gte]: new Date(startYear, startMonth - 1, startDate, 0, 0, 0),
                                [Op.lte]: new Date(endYear, endMonth - 1, endDate, 23, 59, 59)
                            }
                        }
                    }
                };
            }

            registrations = await getAllNewMentorRegistrationByPageFilterWithCondition(page, limit, condition, include);
            count = await countAllNewMentorRegistrationFilterWithCondition(condition, include);
        } else {
            registrations = await getAllNewMentorRegistrationByPage(page, limit);
        }

        for (const registration of registrations) {
            const userData = {
                id: registration.create_by_user.dataValues.id,
                fullname: registration.create_by_user.fullname,
                email: registration.create_by_user.email,
                phone: registration.create_by_user.phone,
                activeDay: registration.create_by_user.activeDay,
                is_active: registration.create_by_user.is_active
            };
            const registrationData = {
                id: registration.dataValues.id,
                reason_register: registration.reason_register,
                consulting_field: registration.consulting_field,
                status_id: registration.status_id,
                createdAt: registration.createdAt
            };

            const data = { registration: registrationData, user: userData };
            if (count) {
                data.count = count;
                data.pages = Math.ceil(count / limit);
            }
            payload.push(data);
        }

        return ReS(res, { allPages: mentorRegistrationPages, allRegistrations: countRegistations, data: payload }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateMentorRegistration = async (req, res, next) => {
    const { id, action } = req.query;
    const { language = 'en' } = req.user;
    if (!id || !action) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const registration = await getMentorRegistrationByID(id);
        if (!registration) return ReE(res, getTranslate('Can Not Found Mentor Registration', language), 404, errorCode.NotFound);

        const newRequest = await isNewRegistration(id);

        if (!newRequest) return ReE(res, getTranslate('Mentor Registration Is Not New', language), 403, errorCode.Forbidden);

        if (action === 'approve') {
            await approveMentorRegistration(registration.create_by_user_id, registration.reason_register);

            // Create consulting_field for mentor after approve
            for (const consulting_field of registration.consulting_field) {
                await addConsultingfieldToUser(registration.create_by_user_id, consulting_field.id);
            }
            return ReS(res, { message: `${action} thành công mentor request id: ${id}` }, 200);
        } else if (action === 'reject') {
            await rejectMentorRegistration(registration.create_by_user_id);
            return ReS(res, { message: `${action} thành công mentor request id: ${id}` }, 200);
        } else {
            return ReE(res, getTranslate('Can Not Perform This Action', language), 403, errorCode.Forbidden);
        }
    } catch (error) {
        next(error);
    }
};

export const getAllNewMentorRegistrationPageNumber = async (req, res, next) => {
    const limit = req.params.limit * 1;
    const { language } = req.user;
    if (!req.params.limit) return ReE(res, getTranslate('Can Not Found Mentor Registration', language), 404, errorCode.NotFound);

    try {
        const countedNewRegistrations = await countAllNewMentorRegistration();
        const countedPages = Math.ceil(countedNewRegistrations / limit);
        return ReS(res, { pages: countedPages }, 200);
    } catch (error) {
        next(error);
    }
};

export const getCountAllNewMentorRegistrations = async (req, res, next) => {
    try {
        const count = await countAllNewMentorRegistration();
        return ReS(res, { count: count }, 200);
    } catch (error) {
        next(error);
    }
};
