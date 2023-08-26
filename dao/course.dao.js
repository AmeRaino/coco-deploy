import { Course, CourseBanner, CourseReviews, User, ConsultingField } from '../models';
const { Op } = require('sequelize');
var Sequelize = require('sequelize');

async function findOneCourse(id) {
    try {
        const result = await Course.findByPk(id);
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneUser()`);
    }
}

const getOneDetailedCourse = async (course_id) => {
    try {
        return await Course.findByPk(course_id, {
            include: [
                {
                    model: ConsultingField,
                    as: 'consulting_field',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ]
        });
    } catch (error) {
        throw new Error(`${error}, traceback getOneDetailedCourse() at course.dao.js`);
    }
};

async function findOneCourseDetail(id) {
    try {
        const result = await Course.findByPk(id, {
            include: [
                {
                    model: ConsultingField,
                    as: 'consulting_field',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: CourseBanner,
                    as: 'course_banner',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: CourseReviews,
                    as: 'course_review',
                    attributes: {
                        // "rate"
                        exclude: ['createdAt', 'updatedAt', 'id', 'course_id', 'create_by_user_id', 'content'],
                        include: [[Sequelize.fn('COUNT', Sequelize.col('rate')), 'count']]
                    }
                },
                {
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            group: 'course_review.rate',
            attributes: {
                // include: [[Sequelize.fn("AVG", Sequelize.col("course_review.rate")), "rate"]]
            }
        }).then((data) => {
            if (data) {
                let sum = 0,
                    count_sum = 0;
                data.course_review.forEach((element) => {
                    sum += element.rate * element.dataValues.count;
                    count_sum += 1 * element.dataValues.count;
                });
                data.dataValues.rate_avg = (sum / count_sum).toFixed(2);
            }
            return data;
        });

        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneUser()`);
    }
}

async function findAndCountAllCourseBySearch(search, amount, page, order, arrangement) {
    try {
        const { countGroup, rows } = await Course.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        name_en: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        name_vi: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ]
                // [Op.and]: [
                //     filterIsTrial
                // ]
            },
            include: [
                {
                    model: CourseReviews,
                    as: 'course_review',
                    attributes: ['rate']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: {
                include: [[Sequelize.fn('AVG', Sequelize.col('course_review.rate')), 'rate']]
            },
            subQuery: false,
            limit: amount * 1,
            offset: page * amount,
            group: ['Course.id'],
            order: [[order, arrangement]]
        });

        const count = await Course.count({
            where: {
                [Op.or]: [
                    {
                        name_en: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        name_vi: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ]
                // [Op.and]: [
                //     filterIsTrial
                // ]
            }
            // limit: amount * 1,
            // offset: page * amount,
            // order: [
            //     [order, arrangement],
            // ]
        });
        return { count, rows };
    } catch (error) {
        throw new Error(`${error}, traceback findAndCountAllCourseBySearch()`);
    }
}

async function deleteCourse(id) {
    try {
        const check = await Course.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback deleteCourse()`);
    }
}

const createOneCourse = async (body) => {
    try {
        const createdCourse = await Course.create({
            ...body,
            name_en: body?.name_en,
            detail_en: body?.detail_en
        });
        return createdCourse;
    } catch (error) {
        throw new Error(`${error}, traceback createCourse()`);
    }
};

const updateCourseByID = async (course_id, data) => {
    try {
        const updatedCourse = await Course.update(
            {
                center_name: data?.center_name,
                teacher_name: data?.teacher_name,
                name_en: data?.name_en,
                name_vi: data?.name_vi,
                tuition: data?.tuition,
                detail_en: data?.detail_en,
                detail_vi: data?.detail_vi,
                thumbnail: data?.thumbnail,
                registration_link: data?.registration_link,
                start_time: data?.start_time,
                end_time: data?.end_time
            },
            {
                where: {
                    id: course_id
                }
            }
        );
        return updatedCourse;
    } catch (error) {
        throw new Error(`${error}, traceback updateCourseByID function at course.dao.js file`);
    }
};

const getCoursesByPageAndLimit = async (page, limit, arrangement) => {
    try {
        const courses = await Course.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            offset: page * limit,
            limit: limit,
            order: [['createdAt', arrangement]]
        });
        return courses;
    } catch (error) {
        throw new Error(`${error}, traceback getCoursesByPageAndLimit function at course.dao.js file`);
    }
};

const countAllCourses = async () => {
    try {
        const countedCourses = await Course.findAndCountAll();
        return countedCourses.count;
    } catch (error) {
        throw new Error(`${error}, traceback countAllCourses function at course.dao.js file`);
    }
};

const getAllCourses = async () => {
    try {
        const countedCourses = await Course.findAll();
        return countedCourses;
    } catch (error) {
        throw new Error(`${error}, traceback getAllCourses function at course.dao.js file`);
    }
};

module.exports = {
    countAllCourses,
    getCoursesByPageAndLimit,
    createOneCourse,
    findOneCourse,
    findOneCourseDetail,
    findAndCountAllCourseBySearch,
    deleteCourse,
    updateCourseByID,
    getOneDetailedCourse,
    getAllCourses
};
