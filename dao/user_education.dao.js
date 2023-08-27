import { UserEducation } from '../models';

export const findUserEducationByID = async (id) => {
    try {
        return UserEducation.findByPk(id);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserExperiencesByUserID function at user_education.dao.js file`);
    }
};

export const createUserEducation = async (data) => {
    try {
        return await UserEducation.create(data);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback createUserEducation function at user_education.dao.js file`);
    }
};

export const updateOneUserEducationByID = async (education_id, update) => {
    try {
        await UserEducation.update(update, {
            where: {
                id: education_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback updateOneUserEducationByID function at user_education.dao.js file`);
    }
};

export const deleteOneUserEducationByID = async (id) => {
    try {
        await UserEducation.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteOneUserEducationByID function at user_experience.dao.js file`);
    }
};

export const deleteAllUserEducationByUserID = async (user_id) => {
    try {
        await UserEducation.destroy({
            where: {
                user_id: user_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteAllUserEducationByUserID function at user_experience.dao.js file`);
    }
};
