import { Banner } from '../models';

export const createOneBanner = async (banner_name, banner_url, file_name, ordinal_number, status, type) => {
    try {
        return await Banner.create({
            banner_name: banner_name,
            banner_directory: 'public/banner/' + file_name,
            banner_url: banner_url,
            ordinal_number: ordinal_number,
            status: status,
            type: type
        });
    } catch (error) {
        throw new Error(`${error}, traceback at createBanner function at banner.dao.js file`);
    }
};

export const getOneBannerById = async (id) => {
    try {
        return await Banner.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback at getOneBannerById function at banner.dao.js file`);
    }
};
export const updateBannerFiledOrder = async (ordinal_number, id) => {
    try {
        await Banner.update(
            {
                ordinal_number: ordinal_number
            },
            {
                where: {
                    id: id
                }
            }
        );
    } catch (error) {
        throw new Error(`${error}, traceback at updateBannerFileOrder function at banner.dao.js file`);
    }
};
export const getAllBanner = async () => {
    try {
        const data = await Banner.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['ordinal_number', 'ASC']]
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback at getAllBanners function at banner.dao.js file`);
    }
};

export const getAllBannerVer2 = async (condition, page, limit) => {
    try {
        const { rows, count } = await Banner.findAndCountAll({
            where: condition,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            offset: page * limit,
            limit: limit
        });

        return { rows, count };
    } catch (error) {
        throw new Error(`Error: ${error}, traceback at getAllBannerVer2 function at banner.dao.js file`);
    }
};

export const checkBannerExsistByOrdinalNumber = async (ordinal_number) => {
    try {
        return await Banner.findOne({
            where: {
                ordinal_number: ordinal_number
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback at checkBannerExsistByOrdinalNumber function at banner.dao.js file`);
    }
};

export const updateBannerByFieldname = async (fieldname, filename, target, target_id) => {
    try {
        await Banner.update(
            {
                banner_url: 'public/banner/' + filename,
                target: target,
                target_id: target_id
            },
            {
                where: {
                    field_name: fieldname
                }
            }
        );
    } catch (error) {
        throw new Error(`${error}, traceback at checkBannerByFieldname function at banner.dao.js file`);
    }
};
export const updateBannerByOrdinal = async (banner_name, banner_url, file, ordinal_number, status, type) => {
    if (file) {
        try {
            return await Banner.update(
                {
                    banner_name: banner_name,
                    banner_directory: 'public/banner/' + file.filename,
                    banner_url: banner_url,
                    status: status,
                    type: type
                },
                {
                    where: {
                        ordinal_number: ordinal_number
                    }
                }
            );
        } catch (error) {
            throw new Error(`${error}, traceback at if updateBannerById function at banner.dao.js file`);
        }
    } else {
        try {
            return await Banner.update(
                {
                    banner_name: banner_name,
                    banner_url: banner_url,
                    ordinal_number: ordinal_number,
                    status: status,
                    type: type
                },
                {
                    where: {
                        ordinal_number: ordinal_number
                    }
                }
            );
        } catch (error) {
            throw new Error(`${error}, traceback at else updateBannerById function at banner.dao.js file`);
        }
    }
};
export const deleteBannerById = async (id) => {
    try {
        await Banner.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback at deleteBannerById function at banner.dao.js file`);
    }
};
