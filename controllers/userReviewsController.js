import { ReE, ReS } from '../utils/util.service';
import { errorCode } from '../utils/util.helper';

import { findAndCountAllReivewUser, createUserReviews as createUserReviewsDao } from '../dao/user_reviews.dao';
import { findOneUser } from '../dao/user.dao';
import { createUserReviewTag } from '../dao/user_reviews_tag.dao';
import { getTranslate } from '../utils/translate';

export async function getAllMentorReview(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'id', arrangement = 'ASC' } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        }

        let { count, rows } = await findAndCountAllReivewUser(req.params.id, amount, page, order, arrangement);
        return ReS(
            res,
            {
                count: count,
                data: rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function createMentorReviews(req, res, next) {
    try {
        var { rate, content, tag } = req.body;
        if (!req.params.id) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }

        const exist = await findOneUser(req.params.id);
        if (!exist) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }

        let data = await createUserReviewsDao(req.params.id, req.user.id, rate, content);

        if (tag && typeof tag == 'object') {
            tag.forEach((element) => {
                createUserReviewTag(element, data.id);
            });
        }

        if (data)
            return ReS(
                res,
                {
                    data,
                    message: getTranslate('Create Successfully', req.user.language)
                },
                200
            );
        return ReE(res, getTranslate('Create Unsuccessfully', req.user.language), 400, contantStatus.errorCode.Exception);
    } catch (error) {
        next(error);
    }
}
