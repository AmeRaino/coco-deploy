const { RoleType } = require('../models');
const contantStatus = require('../utils/util.helper');
const RoleTypeConstant = require('../constants/RoleTypeConstant');

exports.createDefaultRoleType = async () => {
    const data = await RoleType.findAll();
    if (data.length == 0) {
        for (const [key, value] of Object.entries(RoleTypeConstant)) {
            RoleType.create(value);
        }
    }
};

exports.getRoleType = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }
        let data = await RoleType.findByPk(req.params.id, {
            include: [
                {
                    model: PointMarker,
                    as: 'point_marker',
                    attributes: ['id', 'data']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
        if (data)
            return ReS(
                res,
                {
                    data: data
                },
                200
            );
        else return ReE(res, 'RoleType type not found', 404, contantStatus.errorCode.NotFound);
    } catch (error) {
        next(error);
    }
};
