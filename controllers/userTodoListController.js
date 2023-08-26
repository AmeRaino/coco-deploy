import { to, ReE, ReS, TE } from '../utils/util.service';
import { errorCode, successCode } from '../utils/util.helper';
import { getTranslate } from '../utils/translate';

import { createUserTodoList, findAllDateTodoListByMonthYear, findAllTodoListByDate, changeComplete, updateTask, deleteTask } from '../dao/user_todo_list.dao';
export async function findAllDateTodoListByMonthYearOfUser(req, res, next) {
    try {
        let { month, year } = req.query;
        if (!month || !year) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        }

        let data = await findAllDateTodoListByMonthYear(month, year, req.user.id);
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

export async function findAllTodoListByDateOfUser(req, res, next) {
    try {
        let { date } = req.query;
        if (!date) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        }

        let data = await findAllTodoListByDate(date, req.user.id);
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

export async function createTodoListOfUser(req, res, next) {
    try {
        var { describe, date } = req.body;
        if (!describe || !date) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        }

        let data = await createUserTodoList(req.user.id, date, describe);

        if (data)
            return ReS(
                res,
                {
                    data,
                    message: getTranslate('Create Data Success', req.user.language)
                },
                200
            );
        return ReE(res, getTranslate('Create Data Fail', req.user.language), 400, errorCode.Exception);
    } catch (error) {
        next(error);
    }
}

export async function changeCompleteTodo(req, res, next) {
    try {
        var { complete } = req.body;

        const doc = await changeComplete(req.params.id, complete);

        if (doc == false) {
            return ReE(res, getTranslate('Update Data Fail', req.user.language), 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                data: complete,
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateTodoTask (req, res, next) {
    try {
        const { content } = req.body;
        if (!content) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        }

        const result = await updateTask(req.user.id, req.params.id, content);
        if(!result){
            return ReE(res, getTranslate('Update Data Fail', req.user.language), 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                data: content,
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

export async function deleteTodoTask (req, res, next) {
    try {
        const result = await deleteTask(req.user.id, req.params.id);
        if(!result){
            return ReE(res, getTranslate('Delete Data Fail', req.user.language), 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                message: getTranslate('Delete Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
