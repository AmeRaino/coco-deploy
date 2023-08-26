import { to, ReE, ReS, TE } from '../utils/util.service';
import { errorCode, successCode } from '../utils/util.helper';
import { findAndCountAllReivewByCourse, createCourseReviews as createCourseReviewsDao } from '../dao/course_reviews.dao';
import { findOneCourse } from '../dao/course.dao';
import { createCourseReviewTag } from '../dao/course_reviews_tag.dao';
import { getTranslate } from '../utils/translate';

export async function getAllCourseReviewByCourse(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'id', arrangement = 'ASC' } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        }

        let { count, rows } = await findAndCountAllReivewByCourse(req.params.id, amount, page, order, arrangement);
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

export async function createCourseReviews(req, res, next) {
    try {
        var { rate, content, tag } = req.body;
        if (!req.params.id) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }

        const exist = await findOneCourse(req.params.id);
        if (!exist) {
            return ReE(res, 'Course not found', 400, errorCode.NotFound);
        }

        let data = await createCourseReviewsDao(req.params.id, req.user.id, rate, content);

        if (tag && typeof tag == 'object') {
            tag.forEach((element) => {
                createCourseReviewTag(element, data.id);
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
