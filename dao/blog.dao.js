import { Op } from 'sequelize';
import { Blog, User } from '../models';

export const findAndCountAllBlogBySearch = async (search, amount, page, order, arrangement) => {
    try {
        const { rows } = await Blog.findAndCountAll({
            where: {
                title: { [Op.like]: '%' + search + '%' }
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password']
                    }
                }
            ],
            subQuery: false,
            limit: amount * 1,
            offset: page * amount,
            group: ['Blog.id'],
            order: [[order, arrangement]]
        });

        const count = await Blog.count({
            where: {
                title: { [Op.like]: '%' + search + '%' }
            }
        });

        return { count, rows };
    } catch (error) {
        throw new Error(`${error}, traceback findAndCountAllBlogBySearch()`);
    }    
};

export const findOneBlog = async (blog_id) => {
    try {
        const result = await Blog.findByPk(blog_id);
        
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneBlog()`);
    }
};

export const findOneBlogDetail = async (blog_id) => {
    try {
        const result = await Blog.findByPk(blog_id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password']
                    }
                }
            ]
        });

        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneBlogDetail()`);
    }
};

export const findAllBlogsOfUser = async (user_id) => {
    try {
        const result = await Blog.findAll({
            where: {
                created_user_id: user_id,
            },
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password']
                    }
                }
            ]
        });

        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllBlogsOfUser()`);
    }
};