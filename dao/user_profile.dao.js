import {
    User,
    UserEducation,
    UserExperience,
    UserSkill,
    UserPrize,
    UserExtracurricularActivities,
    UserCertificate,
    UserConsultingField
} from '../models';
const { Op, col } = require('sequelize');

module.exports = {
    deleteUserEducation,
    deleteUserExperience,
    deleteUserSkill,
    deleteUserPrize,
    deleteUserCertificate,
    deleteUserExtracurricularActivities,
    deleteUserConsultingField,
    findUserConsultingFieldOfUser
};

export async function deleteUserEducation(id) {
    try {
        const check = await UserEducation.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserEducation()`);
    }
}

export async function deleteUserExperience(id) {
    try {
        const check = await UserExperience.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserExperience()`);
    }
}

export async function deleteUserSkill(id) {
    try {
        const check = await UserSkill.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserSkill()`);
    }
}

export async function deleteUserPrize(id) {
    try {
        const check = await UserPrize.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserPrize()`);
    }
}

export async function deleteUserCertificate(id) {
    try {
        const check = await UserCertificate.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserCertificate()`);
    }
}

export async function deleteUserExtracurricularActivities(id) {
    try {
        const check = await UserExtracurricularActivities.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserExtracurricularActivities()`);
    }
}

export async function deleteUserConsultingField(id) {
    try {
        const check = await UserConsultingField.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback delete UserConsultingField()`);
    }
}
async function findUserConsultingField(id) {
    try {
        const result = await Course.findByPk(id);
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneUser()`);
    }
}
export async function findUserConsultingFieldOfUser(user_id, consulting_field_id) {
    try {
        const data = await UserConsultingField.findOne({
            where: {
                user_id,
                consulting_field_id
            }
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback delete findUserConsultingField()`);
    }
}
