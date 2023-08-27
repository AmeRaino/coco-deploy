import { User, Course, CourseReviewTag } from '../models';
const { Op, Sequelize } = require('sequelize');

export async function createCourseReviewTag(courseReviewSuggestionTagId, courseReviewId) {
    try {
        const result = await CourseReviewTag.create({
            course_review_suggestion_tag_id: courseReviewSuggestionTagId,
            course_review_id: courseReviewId
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createCourseReviewTag()`);
    }
}
