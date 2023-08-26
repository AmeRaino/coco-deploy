import { to, ReE, ReS, TE } from '../utils/util.service';
import { Banner } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { getAll } from './baseController';
import { getAllBanner as getAllBannerDao } from '../dao/banner.dao';
import { Op } from 'sequelize';

export const getAllBanner = async (req, res, next) => {
    try {
        const banners = await getAllBannerDao();
        return ReS(res, { data: banners }, 200);
    } catch (error) {
        next(error);
    }
};
