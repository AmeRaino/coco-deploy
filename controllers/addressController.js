import { to, ReE, ReS, TE } from '../utils/util.service';
import { Province, District, Ward } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { getAll } from './baseController';

export const getAllProvince = getAll(Province);
export const getAllDistrict = getAll(District);
export const getAllWard = getAll(Ward);

export async function getAllDistrictByProvinceId(req, res, next) {
    try {
        let data = await District.findAll({
            where: {
                province_id: req.params.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getAllWardByDistrictId(req, res, next) {
    try {
        let data = await Ward.findAll({
            where: {
                district_id: req.params.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}
