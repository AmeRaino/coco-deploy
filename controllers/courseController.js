import { to, ReE, ReS, TE } from '../utils/util.service';
import { Course, Role, Organization } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { deleteOne } from './baseController';
var Sequelize = require('sequelize');

import { findAndCountAllCourseBySearch, findOneCourse, findOneCourseDetail } from '../dao/course.dao';

export async function getAllCourse(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'id', search = '', arrangement = 'ASC' } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }

        if (order == '') {
            order = 'id';
        } else if (order == 'rate') {
            order = Sequelize.fn('AVG', Sequelize.col('course_review.rate'));
        } else if(order == 'tuition'){
            order =  Sequelize.cast(Sequelize.col('tuition'), 'integer') 
        }

        let { count, rows } = await findAndCountAllCourseBySearch(search, amount, page, order, arrangement);
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

export async function getCourse(req, res, next) {
    try {
        const data = await findOneCourseDetail(req.params.id);
        if (!data) {
            return ReE(res, 'Course not found', 400, errorCode.NotFound);
        }
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

export const deleteCourse = deleteOne(Course);
