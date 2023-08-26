import { UserSkill } from '../models';

export const findUserSkillByID = async (id) => {
    try {
        return UserSkill.findByPk(id);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserSkillByID function at user_skill.dao.js file`);
    }
};

export const createUserSkill = async (data) => {
    try {
        return await UserSkill.create(data);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback createUserSkill function at user_skill.dao.js file`);
    }
};

export const updateOneUserSkillByID = async (skill_id, update) => {
    try {
        await UserSkill.update(update, {
            where: {
                id: skill_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback updateOneUserSkillByID function at user_skill.dao.js file`);
    }
};

export const deleteOneUserSkillByID = async (id) => {
    try {
        await UserSkill.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteOneUserSkillByID function at user_skill.dao.js file`);
    }
};

export const deleteAllUserSkillByID = async (user_id) => {
    try {
        await UserSkill.destroy({
            where: {
                user_id: user_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteAllUserSkillByID function at user_skill.dao.js file`);
    }
};
