import { UserExtracurricularActivities } from '../models';

export const findUserExtracurricularActivitiesByID = async (id) => {
    try {
        return UserExtracurricularActivities.findByPk(id);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserExtracurricularActivitiesByID function at user_extracurricular_activities.dao.js file`);
    }
};

export const createUserExtracurricularActivities = async (data) => {
    try {
        return await UserExtracurricularActivities.create(data);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserExtracurricularActivitiesByID function at user_extracurricular_activities.dao.js file`);
    }
};

export const updateOneUserExtracurricularActivitiesByID = async (activities_id, update) => {
    try {
        await UserExtracurricularActivities.update(update, {
            where: {
                id: activities_id
            }
        });
    } catch (error) {
        throw new Error(
            `Error: ${error}, traceback updateOneUserExtracurricularActivitiesByID function at user_extracurricular_activities.dao.js file`
        );
    }
};

export const deleteOneUserExtracurricularActivitiesByID = async (id) => {
    try {
        await UserExtracurricularActivities.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(
            `Error: ${error}, traceback deleteOneUserExtracurricularActivitiesByID function at user_extracurricular_activities.dao.js file`
        );
    }
};
export const deleteAllUserExtracurricularActivitiesByID = async (user_id) => {
    try {
        await UserExtracurricularActivities.destroy({
            where: {
                user_id: user_id
            }
        });
    } catch (error) {
        throw new Error(
            `Error: ${error}, traceback deleteAllUserExtracurricularActivitiesByID function at user_extracurricular_activities.dao.js file`
        );
    }
};
