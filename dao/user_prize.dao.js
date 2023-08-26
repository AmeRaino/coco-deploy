import { UserPrize } from '../models';

export const findUserPrizeByID = async (id) => {
    try {
        return UserPrize.findByPk(id);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserPrizeByID function at user_prize.dao.js file`);
    }
};

export const createUserPrize = async (data) => {
    try {
        return await UserPrize.create(data);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserPrizeByID function at user_prize.dao.js file`);
    }
};

export const updateOneUserPrizeByID = async (prize_id, update) => {
    try {
        await UserPrize.update(update, {
            where: {
                id: prize_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback updateOneUserPrizeByID function at user_prize.dao.js file`);
    }
};

export const deleteOneUserPrizeByID = async (id) => {
    try {
        await UserPrize.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteOneUserPrizeByID function at user_prize.dao.js file`);
    }
};
export const deleteAllUserPrizeByID = async (user_id) => {
    try {
        await UserPrize.destroy({
            where: {
                user_id: user_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteAllUserPrizeByID function at user_prize.dao.js file`);
    }
};
