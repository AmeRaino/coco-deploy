import { UserExperience } from '../models';

export const findUserExperiencesByID = async (id) => {
    try {
        return UserExperience.findByPk(id, {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserExperiencesByID function at user_experience.dao.js file`);
    }
};

export const createUserExperience = async (data) => {
    try {
        return await UserExperience.create(data);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback createUserExperience function at user_experience.dao.js file`);
    }
};

export const updateOneUserExperienceByID = async (experience_id, update) => {
    try {
        await UserExperience.update(update, {
            where: {
                id: experience_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback updateOneUserExperienceByID function at user_experience.dao.js file`);
    }
};

export const deleteOneUserExperienceByID = async (id) => {
    try {
        await UserExperience.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteOneUserExperienceByID function at user_experience.dao.js file`);
    }
};

export const deleteAllUserExperienceByUserID = async (user_id) => {
    try {
        await UserExperience.destroy({
            where: {
                user_id: user_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteAllUserExperienceByUserID function at user_experience.dao.js file`);
    }
};
