import { UserTodoList } from '../models';
const { Op, Sequelize } = require('sequelize');

export async function createUserTodoList(userId, date, describe) {
    try {
        const result = await UserTodoList.create({
            user_id: userId,
            date: date,
            describe: describe
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createUserTodoList()`);
    }
}

export async function findAllDateTodoListByMonthYear(month, year, userId) {
    try {
        let data = await UserTodoList.findAll({
            where: {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year)
                ],
                user_id: userId
            },
            attributes: [
                'date',
                [Sequelize.fn('MONTH', Sequelize.col('date')), 'date-month'],
                [Sequelize.fn('YEAR', Sequelize.col('date')), 'date-year'],
                // [Sequelize.literal(`COUNT(*)`), 'count']
                'user_id'
            ],
            group: [
                Sequelize.fn('DAY', Sequelize.col('date'))
                // Sequelize.fn('MONTH', Sequelize.col('date')),
                // Sequelize.fn('YEAR', Sequelize.col('date'))
            ],
            order: ['date']
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback findAllDateTodoListByMonthYear()`);
    }
}

export async function findAllTodoListByDate(date, userId) {
    try {
        let data = await UserTodoList.findAll({
            where: {
                date: date,
                user_id: userId
            },
            order: ['createdAt']
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback findAllTodoListByDate()`);
    }
}

export async function changeComplete(id, complete) {
    try {
        const result = await UserTodoList.update(
            {
                complete: complete
            },
            {
                where: { id: id }
            }
        );
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback changeComplete()`);
    }
}

export async function updateTask(userId, taskId, content) {
    try {
        const result = await UserTodoList.update(
            {
                describe: content
            },
            {
                where: {
                    [Op.and]: {
                        user_id: userId,
                        id: taskId
                    }
                }
            }
        );
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback updateTask()`);
    }
};

export async function deleteTask(userId, taskId) {
    try {
        const result = await UserTodoList.destroy({
            where: {
                [Op.and]: {
                    user_id: userId,
                    id: taskId
                }
            }
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback deleteTask()`);
    }
};