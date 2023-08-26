import { findAllBlogsOfUser, findAndCountAllBlogBySearch, findOneBlogDetail } from "../dao/blog.dao";
import { Sequelize } from "../models";
import { getTranslate } from "../utils/translate";
import { errorCode } from "../utils/util.helper";
import { ReE, ReS } from "../utils/util.service";

export async function getAllBlog(req, res, next) {
    try {
        let {
            page = 0,
            amount = 10,
            order = 'id',
            search = '',
            arrangement = 'ASC'
        } = req.query;
        if(!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == ''){
            arrangement = 'ASC';
        }
        if (order == '' ) order = 'id'

        let { count, rows } = await findAndCountAllBlogBySearch(search, amount, page, order, arrangement);
        return ReS(
            res,
            {
                count: count,
                data: rows
            },
            200
        );
    } catch (error) {
        next(error)
    }
};

export async function getBlog(req, res, next) {
    try {
        const data = await findOneBlogDetail(req.params.blog_id);
        if(!data){
            return ReE(res, getTranslate('Blog not found', req.user.language), 400, errorCode.NotFound);
        }
        else {
            return ReS(
                res,
                {
                    data
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
}

export async function getBlogsOfUser(req, res, next) {
    try {
        const language = req.body.language;

        const data = await findAllBlogsOfUser(req.params.user_id);

        if(!data){
            return ReE(res, getTranslate('User has no blog', language), 404, errorCode.NotFound);
        }
        else{
            return ReS(res, { data }, 200);
        }
    } catch (error) {
        next(error);
    }
}