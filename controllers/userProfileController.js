import { ReE, ReS } from '../utils/util.service';
import { getTranslate } from '../utils/translate';
import {
    User,
    UserExperience,
    UserEducation,
    UserSkill,
    UserPrize,
    UserExtracurricularActivities,
    UserCertificate,
    UserConsultingField
} from '../models';
import { errorCode } from '../utils/util.helper';
import { __ } from 'i18n';
import {
    deleteUserEducation,
    deleteUserExperience,
    deleteUserSkill,
    deleteUserCertificate,
    deleteUserPrize,
    deleteUserExtracurricularActivities,
    deleteUserConsultingField,
    findUserConsultingFieldOfUser
} from '../dao/user_profile.dao';

import { getUserDetail } from '../dao/user.dao';

export async function getUser(req, res, next) {
    try {
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
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getMyProfileDetail(req, res, next) {
    try {
        const data = await getUserDetail(req.user.id);
        if (!data) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }
        delete data.password;
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

export async function changeLanguageUser(req, res, next) {
    try {
        let language;
        language = req.user.language == 'vi' ? 'en' : 'vi';
        console.log('language', language);
        const doc = await User.update({ language: language }, { where: { id: req.user.id } });

        if (doc == false) {
            return ReE(res, 'Update không thành công', 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                data: language,
                mes: getTranslate('Change Language Success', language),
                message: 'Đổi ngôn ngữ thành công'
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

export async function updateMyProfileIntroduce(req, res, next) {
    try {
        var { introduce_yourself, job} = req.body;

        let dataUserUpdate = {
            introduce_yourself,
            job
        };
        const doc = await User.update(dataUserUpdate, { where: { id: req.user.id } });

        if (doc == false) {
            return ReE(res, getTranslate('Update Data Fail', req.user.language), 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfileEducation(req, res, next) {
    try {
        var { education } = req.body;

        education.forEach((element) => {
            if (element.isDelete) {
                deleteUserEducation(element.id);
            } else if (element.id != null && element.id != '') {
                UserEducation.update(
                    {
                        user_id: req.user.id,
                        school_name: element.school_name,
                        specialized_major: element.specialized_major,
                        start_time: element.start_time,
                        end_time: element.end_time,
                        scores: element.scores,
                        until_now: element.until_now
                    },
                    { where: { id: element.id } }
                );
            } else {
                //(element.id == null || element.id == "")
                const user = UserEducation.create({
                    user_id: req.user.id,
                    school_name: element.school_name,
                    specialized_major: element.specialized_major,
                    start_time: element.start_time,
                    end_time: element.end_time,
                    scores: element.scores,
                    until_now: element.until_now
                });
            }
        });

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfileExperience(req, res, next) {
    try {
        var { experience } = req.body;
        if (!experience || typeof experience != 'object') {
            return ReE(res, 'You are missing field', 400, errorCode.DataNull);
        }

        experience.forEach((element) => {
            if (element.isDelete) {
                deleteUserExperience(element.id);
            } else if (element.id != null && element.id != '') {
                UserExperience.update(
                    {
                        user_id: req.user.id,
                        company_name: element.company_name,
                        start_time: element.start_time,
                        end_time: element.end_time,
                        working_position: element.working_position,
                        consulting_field_id: element.consulting_field_id,
                        until_now: element.until_now,
                        job_description: element.job_description
                    },
                    { where: { id: element.id } }
                );
            } else {
                //(element.id == null || element.id == "")
                UserExperience.create({
                    user_id: req.user.id,
                    company_name: element.company_name,
                    start_time: element.start_time,
                    end_time: element.end_time,
                    consulting_field_id: element.consulting_field_id,
                    working_position: element.working_position,
                    until_now: element.until_now,
                    job_description: element.job_description
                });
            }
        });

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfileSkill(req, res, next) {
    try {
        var { skill } = req.body;
        if (!skill || typeof skill != 'object') {
            return ReE(res, 'You are missing field', 400, errorCode.DataNull);
        }

        skill.forEach((element) => {
            if (element.isDelete) {
                deleteUserSkill(element.id);
            } else if (element.id != null && element.id != '') {
                UserSkill.update(
                    {
                        user_id: req.user.id,
                        skill: element.skill,
                        describe: element.describe
                    },
                    { where: { id: element.id } }
                );
            } else {
                //(element.id == null || element.id == "")
                UserSkill.create({
                    user_id: req.user.id,
                    skill: element.skill,
                    describe: element.describe
                });
            }
        });

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfilePrize(req, res, next) {
    try {
        var { prize } = req.body;
        if (!prize || typeof prize != 'object') {
            return ReE(res, 'You are missing field', 400, errorCode.DataNull);
        }

        prize.forEach((element) => {
            if (element.isDelete) {
                deleteUserPrize(element.id);
            } else if (element.id != null && element.id != '') {
                UserPrize.update(
                    {
                        user_id: req.user.id,
                        prize: element.prize,
                        achievements: element.achievements,
                        received_date: element.received_date,
                        describe: element.describe
                    },
                    { where: { id: element.id } }
                );
            } else {
                //(element.id == null || element.id == "")
                UserPrize.create({
                    user_id: req.user.id,
                    prize: element.prize,
                    achievements: element.achievements,
                    received_date: element.received_date,
                    describe: element.describe
                });
            }
        });

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfileExtracurricularActivities(req, res, next) {
    try {
        var { extracurricular_activities } = req.body;
        if (!extracurricular_activities || typeof extracurricular_activities != 'object') {
            return ReE(res, 'You are missing field', 400, errorCode.DataNull);
        }

        extracurricular_activities.forEach((element) => {
            if (element.isDelete) {
                deleteUserExtracurricularActivities(element.id);
            } else if (element.id != null && element.id != '') {
                UserExtracurricularActivities.update(
                    {
                        user_id: req.user.id,
                        activity: element.activity,
                        position: element.position,
                        start_time: element.start_time,
                        end_time: element.end_time,
                        describe: element.describe
                    },
                    { where: { id: element.id } }
                );
            } else {
                //(element.id == null || element.id == "")
                UserExtracurricularActivities.create({
                    user_id: req.user.id,
                    activity: element.activity,
                    position: element.position,
                    start_time: element.start_time,
                    end_time: element.end_time,
                    describe: element.describe
                });
            }
        });

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateMyProfileCertificate(req, res, next) {
    try {
        var { certificate } = req.body;
        if (!certificate || typeof certificate != 'object') {
            return ReE(res, 'You are missing field', 400, errorCode.DataNull);
        }

        certificate.forEach((element) => {
            if (element.isDelete) {
                deleteUserCertificate(element.id);
            } else if (element.id != null && element.id != '') {
                UserCertificate.update(
                    {
                        user_id: req.user.id,
                        certificate: element.certificate,
                        describe: element.describe,
                        received_date: element.received_date
                    },
                    { where: { id: element.id } }
                );
            } else {
                //(element.id == null || element.id == "")
                UserCertificate.create({
                    user_id: req.user.id,
                    certificate: element.certificate,
                    describe: element.describe,
                    received_date: element.received_date
                });
            }
        });

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updatePersonalInformation(req, res, next) {
    try {
        var { fullname, gender, birthday, ward_id, phone, consulting_field } = req.body;

        if (consulting_field && typeof consulting_field != 'object') {
            return ReE(res, getTranslate('Incorrect Data', language), 400, errorCode.InvalidData);
        }

        User.update(
            {
                fullname,
                gender,
                birthday,
                ward_id,
                phone
            },
            { where: { id: req.user.id } }
        );

        if (consulting_field && typeof consulting_field == 'object') {
            for (const element of consulting_field) {
                if (element.isDelete) {
                    deleteUserConsultingField(element.id);
                } else if (element.id == null || element.id == '') {
                    let data = await findUserConsultingFieldOfUser(req.user.id, element.consulting_field_id);
                    console.log('consulting_field_id', data);
                    if (!data)
                        UserConsultingField.create({
                            user_id: req.user.id,
                            consulting_field_id: element.consulting_field_id
                        });
                }
            }
        }

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
