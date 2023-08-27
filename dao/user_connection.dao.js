import { UserConnection, User, UserExperience } from '../models';
const { Op, col } = require('sequelize');
var Sequelize = require('sequelize');

module.exports = {
    findOneRandomUserConnectionRefused
};

async function findOneRandomUserConnectionRefused(createByUserId) {
    try {
        const data = await UserConnection.findOne({
            where: {
                connected: false,
                connection_request: false,
                created_by_user_id: createByUserId
            },
            include: [
                {
                    model: User,
                    as: 'connected_user',
                    include: [
                        {
                            model: UserExperience,
                            as: 'user_experience',
                            attributes: ['company_name', 'start_time', 'end_time', 'working_position', 'until_now']
                        }
                    ]
                }
            ],
            order: Sequelize.literal('rand()'),
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        return data;
    } catch (error) {
        throw new Error(`${error}, traceback findOneRandomUserConnectionRefused()`);
    }
}
