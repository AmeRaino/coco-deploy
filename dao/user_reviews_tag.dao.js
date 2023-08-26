import { User, UserReviewTag } from '../models';
const { Op, Sequelize } = require('sequelize');

export async function createUserReviewTag(userReviewSuggestionTagId, userReviewId) {
    try {
        const result = await UserReviewTag.create({
            user_review_suggestion_tag_id: userReviewSuggestionTagId,
            user_review_id: userReviewId
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createUserReviewTag()`);
    }
}
