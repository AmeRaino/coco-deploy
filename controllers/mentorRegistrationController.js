import { to, ReE, ReS, TE } from '../utils/util.service';
import { errorCode, successCode } from '../utils/util.helper';
import { getTranslate } from '../utils/translate';
import MentorRegistrationStatusConstant from '../constants/MentorRegistrationStatusConstant';

import { createMentorRegistration, findOneMentorRegistrationWithStatus } from '../dao/mentor_registration.dao';

export async function createMentorRegistrationByUser(req, res, next) {
    try {
        var { consulting_field_id, reason_register } = req.body;
        if (!consulting_field_id) {
            return ReE(res, getTranslate('Missing Data Field', req.user.language), 400, errorCode.DataNull);
        }
        if (typeof consulting_field_id != 'object') {
            return ReE(res, 'Dữ liệu không hợp lệ', 400, errorCode.DataNull);
        }

        let check = await findOneMentorRegistrationWithStatus(req.user.id, MentorRegistrationStatusConstant.New.id);
        if (check) {
            return ReE(res, getTranslate('Data Exists', req.user.language), 400, errorCode.DataNull);
        }

        let data = await createMentorRegistration(req.user.id, reason_register, consulting_field_id);

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

export async function checkMentorRegistrationForm(req, res, next) {
    try {
        let check = await findOneMentorRegistrationWithStatus(req.user.id, MentorRegistrationStatusConstant.New.id);
        if (check) {
            ReS(
                res,
                {
                    registered: true,
                    message: getTranslate('Data Exists', req.user.language)
                },
                200
            );
        }
        return ReS(
            res,
            {
                registered: false,
                message: getTranslate('Data Does Not Exist', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
