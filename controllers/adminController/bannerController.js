import { Op } from 'sequelize';
import {
    updateBannerByOrdinal,
    updateBannerFiledOrder,
    checkBannerExsistByOrdinalNumber,
    createOneBanner,
    deleteBannerById,
    getAllBanner,
    getOneBannerById,
    getAllBannerVer2
} from '../../dao/banner.dao';
import { deleteFile } from '../../lib/deletefile';
import { getTranslate } from '../../utils/translate';
import { errorCode } from '../../utils/util.helper';
import { ReE, ReS } from '../../utils/util.service';

export const updateOneBanner = async (req, res, next) => {
    const banner_type = ['Không xác định', 'Khoá học', 'Mentor', 'Blog'];
    const file = req.file;
    const { language } = req.user;
    const status = req.body.status === 'true' ? true : false;
    const { banner_name, banner_url, ordinal_number, type } = req.body;
    if (banner_name.length > 50) {
        if (file) deleteBannerAfterFailure(file);
        return ReE(res, getTranslate('Over limit', language), 403);
    }

    if (file) {
        const banner = await checkBannerExsistByOrdinalNumber(ordinal_number);
        deleteFile(banner.banner_directory);
    }

    if (!banner_type.includes(type)) {
        if (file) deleteBannerAfterFailure(file);
        // deleteBannerAfterFailure(file);
        return ReE(res, getTranslate('Can Not Perform This Action', language), 403);
    }

    try {
        const updateBanner = await updateBannerByOrdinal(banner_name, banner_url, file, ordinal_number, status, type);

        if (updateBanner)
            return ReS(
                res,
                {
                    message: getTranslate('Update Banner Successfully', language)
                    // direcotry: `public/banner/${file.filename}`
                },
                200
            );
    } catch (error) {
        //nếu mà k thành công thì xóa hình.
        if (file) deleteBannerAfterFailure(file);

        next(error);
    }
};

export const uploadBanners = async (req, res, next) => {
    const banner_type = ['Không xác định', 'Khoá học', 'Mentor', 'Blog'];
    const file = req.file;
    const { language } = req.user;
    const status = req.body.status === 'true' ? true : false;
    const { banner_name, banner_url, ordinal_number, type } = req.body;
    if (banner_name.length > 50) {
        deleteBannerAfterFailure(file);
        return ReE(res, getTranslate('Over limit', language), 403);
    }
    if (!file) {
        deleteBannerAfterFailure(file);
        return ReE(res, getTranslate('Missing Data Field', language), 400);
    }
    if (!banner_type.includes(type)) {
        deleteBannerAfterFailure(file);
        return ReE(res, getTranslate('Can Not Perform This Action', language), 403);
    }
    try {
        const BannerExsit = await checkBannerExsistByOrdinalNumber(ordinal_number);

        if (BannerExsit) {
            deleteBannerAfterFailure(file);
            return ReE(res, getTranslate('Can Not Perform This Action', language), 403);
        } else {
            const createdBanner = await createOneBanner(banner_name, banner_url, file.filename, ordinal_number, status, type);
            if (createdBanner)
                return ReS(
                    res,
                    {
                        message: getTranslate('Upload Images Successfully', language),
                        direcotry: `public/banner/${file.filename}`
                    },
                    200
                );
        }
    } catch (error) {
        //nếu mà k thành công thì xóa hình.
        if (file) deleteBannerAfterFailure(file);

        next(error);
    }
};

export const swapBanner = async (req, res, next) => {
    try {
        const id_cur = req.body.id_current;
        const id_tar = req.body.id_target;
        const bannerCurrent = await getOneBannerById(id_cur);
        const bannerTarget = await getOneBannerById(id_tar);
        // trường hợp 2 banner gần nhau
        if (Math.abs(id_cur - id_tar === 1)) {
            await updateBannerFiledOrder(bannerTarget.ordinal_number, id_cur);
            await updateBannerFiledOrder(bannerCurrent.ordinal_number, id_tar);
        } else if (id_cur < id_tar) {
            //trường hợp kéo banner Current xuống
            await updateBannerFiledOrder(bannerTarget.ordinal_number, id_cur);
            for (let index = id_cur; index < id_tar; index++) {
                const bannerIndex = await getOneBannerById(index + 1);
                await updateBannerFiledOrder(--bannerIndex.ordinal_number, index + 1);
            }
        } else {
            // trường hợp kéo banner Current lên

            await updateBannerFiledOrder(bannerTarget.ordinal_number, id_cur);
            for (let index = id_tar; index < id_cur; index++) {
                const bannerIndex = await getOneBannerById(index);
                await updateBannerFiledOrder(++bannerIndex.ordinal_number, index);
            }
        }

        const banners = await getAllBanner();

        return ReS(res, { banners: banners }, 200);
    } catch (error) {
        next(error);
    }
};

export const orderBanner = async (req, res, next) => {
    try {
        let arrOder = [];
        arrOder = req.body.data;

        console.log(arrOder.length);

        for (let index = 0; index < arrOder.length; index++) {
            await updateBannerFiledOrder(arrOder[index][1], arrOder[index][0]);
            console.log(arrOder[index][1], arrOder[index][0]);
        }
        const banners = await getAllBanner();
        return ReS(res, { banners: banners }, 200);
    } catch (error) {
        next(error);
    }
};

export const getAllBanners = async (req, res, next) => {
    try {
        const banners = await getAllBanner();
        return ReS(res, { banners: banners }, 200);
    } catch (error) {
        next(error);
    }
};

export const getAllBannersVer2 = async (req, res, next) => {
    const type = req.query?.type;
    const page = req.query?.page * 1;
    const limit = req.query?.limit * 1;
    const search = req.query?.search;
    try {
        let condition = {};
        let response = {};
        console.log(type, search);
        if (page || limit || search) {
            if (!page || !limit) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);
            if (search || type) {
                condition = {
                    ...condition,
                    ...{
                        [Op.or]: [
                            {
                                banner_name: { [Op.like]: `%${search}%` }
                            },
                            {
                                type: { [Op.like]: `%${type}%` }
                            }
                        ]
                    }
                };
            }
            const { rows, count } = await getAllBannerVer2(condition, page - 1, limit);
            response.count = count;
            response.banner = rows;
        }
        return ReS(res, response, 200);
    } catch (error) {
        next(error);
    }
};

export const deleteBanner = async (req, res, next) => {
    const { id } = req.params;
    const { language } = req.user;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const check = await getOneBannerById(id);
        if (!check) {
            return ReE(res, getTranslate('Banner Is Not Exist', language), 404, errorCode.NotFound);
        } else {
            let urlLogo = check.dataValues.banner_url;
            deleteFile(urlLogo);
            await deleteBannerById(id);
            return ReS(res, { message: getTranslate('Delete Banner Successfully', language) }, 200);
        }
    } catch (error) {
        next(error);
    }
};

export const getBannerById = async (req, res, next) => {
    const { id } = req.params;
    const { language } = req.user;
    if (!id) return ReE(res, getTranslate('Missing Data Field', language), 400, errorCode.DataNull);

    try {
        const banner = await getOneBannerById(id);
        if (banner) return ReS(res, { banner: banner }, 200);
        return ReE(res, getTranslate('Banner Is Not Exist', language), 404);
    } catch (error) {
        next(error);
    }
};

const deleteBannerAfterFailure = (file) => {
    let urlLogo = 'public/banner/' + file.filename;
    deleteFile(urlLogo);
};
