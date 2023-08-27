import { User, Course, CourseReviews, CourseReviewSuggestionTag } from '../models';

export async function findAndCountAllReivewByCourse(CourseId, amount, page, order, arrangement) {
    try {
        let rows = await CourseReviews.findAll({
            where: {
                course_id: CourseId
            },
            // subQuery: false,
            // required: true,
            include: [
                {
                    model: User,
                    as: 'create_by_user',
                    attributes: ['fullname', 'avatar']
                },
                {
                    model: CourseReviewSuggestionTag,
                    as: 'review_tag',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'id']
                    },
                    through: { attributes: [] }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'user_id']
            },
            limit: amount * 1,
            offset: page * amount,
            order: [[order, arrangement]]
            // raw: true
        });

        let count = await CourseReviews.count({
            where: {
                course_id: CourseId
            },
            attributes: ['id']
        });
        return { count, rows };
    } catch (error) {
        throw new Error(`${error}, traceback findAndCountAllCourseByCourse()`);
    }
}

export async function createCourseReviews(courseId, createByUserId, rate, content) {
    try {
        const result = await CourseReviews.create({
            course_id: courseId,
            create_by_user_id: createByUserId,
            rate: rate,
            content: content
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createCourseReviews()`);
    }
}
