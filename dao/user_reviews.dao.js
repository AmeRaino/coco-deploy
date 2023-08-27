import { User, UserReviews, UserReviewSuggestionTag } from '../models';
const { Op, Sequelize } = require('sequelize');

export async function findAndCountAllReivewUser(UserId, amount, page, order, arrangement) {
    try {
        let rows = await UserReviews.findAll({
            where: {
                user_id: UserId
            },
            // subQuery: false,
            // required: true,
            include: [
                {
                    model: User,
                    as: 'create_by_user',
                    attributes: ['fullname', 'avatar', 'gender']
                },
                {
                    model: UserReviewSuggestionTag,
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

        let count = await UserReviews.count({
            where: {
                user_id: UserId
            },
            attributes: ['id']
            // raw: true
        });
        return { count, rows };
    } catch (error) {
        throw new Error(`${error}, traceback findAndCountAllUserByUser()`);
    }
}

export async function createUserReviews(userId, createByUserId, rate, content) {
    try {
        const result = await UserReviews.create({
            user_id: userId,
            create_by_user_id: createByUserId,
            rate: rate,
            content: content
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createUserReviews()`);
    }
}

export async function getRateUserReview(UserId) {
    try {
        let rate_avg;
        let rows = await UserReviews.findAll({
            where: {
                user_id: UserId
            },
            // subQuery: false,
            // required: true,
            group: 'rate',
            attributes: {
                // include: [[Sequelize.fn("AVG", Sequelize.col("rate")), "rate"]]
                exclude: ['id', 'user_id', 'create_by_user_id', 'content', 'createdAt', 'updatedAt'],
                include: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']]
            }
            // raw: true
        }).then((data) => {
            if (data) {
                let sum = 0,
                    count_sum = 0;
                data.forEach((element) => {
                    sum += element.rate * element.dataValues.count;
                    count_sum += 1 * element.dataValues.count;
                });
                rate_avg = (sum / count_sum).toFixed(2);
            }
            return data;
        });
        return { rate_avg, rows };
    } catch (error) {
        throw new Error(`${error}, traceback getRateUserReview()`);
    }
}
