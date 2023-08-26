import { getTranslate } from '../../utils/translate';
import { ReE, ReS } from '../../utils/util.service';
import { errorCode } from '../../utils/util.helper';
import { createOneCourse, getOneDetailedCourse, findOneCourse, deleteCourse, getCoursesByPageAndLimit, countAllCourses } from '../../dao/course.dao';
import { Course, UserDeviceToken } from '../../models';
import { findOneUser } from '../../dao/user.dao';
import { updateCourseByID } from '../../dao/course.dao';
import { deleteFile } from '../../lib/deletefile';
import {sendNotificationAndSave} from '../../lib/firebase_fcm'
import { forEach } from 'lodash';
//import { deleteCourseBannerByCourseId } from '../../dao/course_banner.dao';

export const createCourse = async (req, res, next) => {
    const { center_name, teacher_id, teacher_name, name_vi, detail_vi, registration_link, consulting_field_id, start_time, end_time } = req.body;
    const { language } = req.user;
    const tuition = req.body.tuition + '';
    if (!center_name || !teacher_name || !name_vi || !tuition || !detail_vi || !registration_link || !consulting_field_id || !start_time || !end_time)
        return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const createdCourse = await createOneCourse(req.body);

        const getAllToken = await UserDeviceToken.findAll();

        getAllToken.forEach(token => {
           
            const sentNotification = sendNotificationAndSave(token.user_id,language,new Date(),detail_vi,req.user.id );

        });

        return ReS(res, { createdCourse: "sentNotification" }, 200);
    } catch (error) {
        next(error);
    }
};

export const getCoursesByPage = async (req, res, next) => {
    const page = (req.query.page - 1) * 1;
    const limit = req.query.limit * 1;
    const { language } = req.user;

    if (!req.query.page || !req.query.limit || !req.query.arrangement)
        return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
    const arrangement =
        req.query.arrangement === 'ASC'
            ? 'ASC'
            : req.query.arrangement === 'DESC'
            ? 'DESC'
            : ReE(res, getTranslate('Wrong Arrangement Type', language), 403, errorCode.Forbidden);

    try {
        const countedCourses = await countAllCourses();
        const pagesNumber = Math.ceil(countedCourses / limit);
        if (req.query.page > pagesNumber) return ReE(res, getTranslate('Page Do Not Exist', language), 404, errorCode.NotFound);

        const courses = await getCoursesByPageAndLimit(page, limit, arrangement);

        return ReS(res, { courses: courses }, 200);
    } catch (error) {
        next(error);
    }
};

export const getCourseDetails = async (req, res, next) => {
    const { id } = req.params;
    const { language = 'en' } = req.user;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const course = await getOneDetailedCourse(id);
        if (!course) return ReE(res, getTranslate('Can Not Find Course', language), 404, errorCode.NotFound);

        return ReS(res, { course: course }, 200);
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req, res, next) => {
    const {
        center_name = '',
        teacher_name = '',
        name_en = '',
        name_vi = '',
        tuition = 0,
        detail_en = '',
        detail_vi = '',
        thumbnail = '',
        registration_link = '',
        // consulting_field_id = 1,
        start_time = '',
        end_time = ''
    } = req.body;
    const { id } = req.params;
    const { language = 'en' } = req.user;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const course = await findOneCourse(id);
        if (!course) return ReE(res, getTranslate('Can Not Find Course', language), 404, errorCode.NotFound);

        await updateCourseByID(id, req.body);

        const updatedCourse = await findOneCourse(id);
        return ReS(res, { updatedCourse: updatedCourse }, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteCourseByID = async (req, res, next) => {
    const { id } = req.params;
    const { language = 'en' } = req.user;

    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const course = await findOneCourse(id);
        if (!course) return ReE(res, getTranslate('Can Not Find Course', language), 404, errorCode.NotFound);

        await deleteCourse(id);
        //await deleteCourseBannerByCourseId(id);
        const urlLogo = course.thumbnail;
        deleteFile(urlLogo);
        return ReS(res, { message: `Delete course with id: ${id}` }, 200);
    } catch (error) {
        next(error);
    }
};

export const uploadCourseBanners = async (req, res, next) => {
    const { language } = req.user;
    const { course_id } = req.query;
    const file = req.file;
    if (!file || !course_id) {
        let urlLogo = url;
        deleteFile(urlLogo);
        return ReE(res, getTranslate('Missing Data Field', language), 400);
    }
   
    const url = `public/course_banner/${file.filename}`;
    const data = {};
    data.thumbnail = url;

    try {
        const checkCourseExist = await findOneCourse(course_id);
        if (!checkCourseExist) return ReE(res, getTranslate('Can Not Find Course', language), 404, errorCode.NotFound);

        await updateCourseByID(course_id, data);
        return ReS(
            res,
            {
                message: getTranslate('Upload Images Successfully', language),
                url: url
            },
            200
        );
    } catch (error) {
        //nếu mà k thành công thì xóa hình.
        if (file) {
            let urlLogo = url;
            deleteFile(urlLogo);
        }
        next(error);
    }
};

export const getCoursePageNumberByLimit = async (req, res, next) => {
    const limit = req.params.limit * 1;
    const { language } = req.user;
    if (!req.params.limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const countedCourses = await countAllCourses();
        const pagesNumber = Math.ceil(countedCourses / limit);
        return ReS(res, { pages: pagesNumber }, 200);
    } catch (error) {
        next(error);
    }
};

export const getCountAllCourse = async (req, res, next) => {
    try {
        const countedCourses = await countAllCourses();
        return ReS(res, { count: countedCourses }, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteCourseBanner = async (req, res, next) => {
    const { banner_url } = req.body;
    const { language } = req.user;
    if (!banner_url) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        deleteFile(banner_url);
        return ReS(res, { message: `delete course banner: ${banner_url}` }, 200);
    } catch (error) {
        next(error);
    }
};
