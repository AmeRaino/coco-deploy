import { to, ReE, ReS, TE } from '../utils/util.service';
import { Course, Role, Organization } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { deleteOne } from './baseController';
var Sequelize = require('sequelize');
import { getTranslate } from '../utils/translate';
import { getAllCourses } from '../dao/course.dao';
import { createOneImmediateNotification } from '../dao/notification.dao';

import { createCourseMemberDao, getMemberCourse, getCourse } from '../dao/course_member.dao';
import moment from 'moment';
import { sendCourseNotification } from '../lib/firebase_fcm';
// import { getCourse } from './courseController';

export async function createCourseMember(req, res, next) {
    try {
        const { course_id, fullname, phone, email, CMND, skypelink, address, school, majors, graduation_year, reason } = req.body;
        if (!course_id || !fullname || !phone || !email || !skypelink || !school || !majors || !graduation_year || !reason)
            return ReE(res, getTranslate('Missing Data Field', req.user.language), 400, errorCode.DataNull);

        let userCkeck = await getMemberCourse(req.user.id, course_id);
        if (userCkeck) {
            return ReE(res, getTranslate('Create Unsuccessfully Already Exist', req.user.language), 400, 400);
        } else {
            let data = await createCourseMemberDao(
                req.user.id,
                course_id,
                fullname,
                phone,
                email,
                CMND,
                skypelink,
                address,
                school,
                majors,
                graduation_year,
                reason
            );

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
        }
    } catch (error) {
        next(error);
    }
}

export async function sendNotificationToMentee(req, res, next) {
    // try {
    const courseMember = await getCourse();

    const course = await getAllCourses();

    const start_course = [];

    for (const i of course) {
        const dateParts = i.start_time.split('/'); // Tách ngày, tháng, năm thành một mảng

        // Tạo đối tượng Date từ ngày, tháng, năm
        const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        // chuyen ve dang ngay thang nam
        const date_format = moment(new Date(date)).format('YYYY-MM-DD');
        // chuyen ngay hien tai thanh dang ngay thang nam
        let ngay = moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format('YYYY-MM-DD');
        // tim ra nhung khoa hoc co ngay bat dau - ngay hien tai bang 1 ngay
        if (new Date(date_format) - new Date(ngay) === 86400000) {
            start_course.push({ id: i.id, name_en: i.name_en, name_vi: i.name_vi });
        }
    }
    // tim ra nhung mentee da dang ky khoa hoc
    for (const j of start_course) {
        for (const i of courseMember) {
            if (i.course_id === j.id) {
                sendCourseNotification(i.user_id, i.fullname, j.name_vi, j.name_en, req.user.id);
            }
        }
    }
}
