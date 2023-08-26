import { Op } from 'sequelize';
import { CourseMember, Course } from '../models';

export const createCourseMemberDao = async (
    user_id,
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
) => {
    try {
        const result = await CourseMember.create({
            user_id: user_id,
            course_id: course_id,
            fullname: fullname,
            phone: phone,
            email: email,
            CMND: CMND,
            skypelink: skypelink,
            address: address,
            school: school,
            majors: majors,
            graduation_year: graduation_year,
            reason: reason
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createCourseMember()`);
    }
};

export const getMemberCourse = async (user_id, course_id) => {
    try {
        const result = await CourseMember.findOne({
            where: {
                user_id: user_id,
                course_id: course_id
            }
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback getMemberCourse()`);
    }
};
export const getCourse = async () => {
    try {
        const result = await CourseMember.findAll({});
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback getCourse()`);
    }
};
