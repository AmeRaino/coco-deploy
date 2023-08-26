var Sequelize = require('sequelize');
const { Op } = require('sequelize');
const { ReE, ReS } = require('../utils/util.service');
const { Role, Permission, RolePermissions, User, RolePermissionType, PermissionSys } = require('../models');
const RoleConstant = require('../constants/RoleConstant');
const contantStatus = require('../utils/util.helper');

exports.createDefaultRoles = async () => {
    const role = await Role.findAll();
    if (role.length == 0) {
        for (const [, value] of Object.entries(RoleConstant)) {
            // console.log(`------${key}---- ${value}`);
            let roleKQ = await Role.create(value);
            if (value.permission) {
                value.permission.forEach((element) => {
                    RolePermissions.create({
                        role_id: roleKQ.dataValues.id,
                        permission_id: element
                    });
                });
            }
        }
    }

    // const rolePermissionType = await RolePermissionType.findAll();
    // if (rolePermissionType.length == 0) {
    //     for (const [key, value] of Object.entries(RolePermissionTypeConstant)) {
    //         RolePermissionType.create(value);
    //     }
    // }

    // const rolePermissionSys = await PermissionSys.findAll();
    // if (rolePermissionSys.length == 0) {
    //     for (const [keyRole, valueRole] of Object.entries(PermissionSysConstant)) {
    //         for (const [key, value] of Object.entries(valueRole)) {
    //             PermissionSys.create(value);
    //         }
    //         // PermissionSys.create(value);
    //     }
    // }
};

exports.getAllRoles = async (req, res, next) => {
    try {
        let { page = 0, amount, order = 'id', search = '', arrangement = 'ASC' } = req.query;
        // data = await Role.findAndCountAll(
        let offset;
        if (!amount || amount <= 0) {
            amount = null;
            offset = null;
        } else {
            amount *= 1;
            offset = page * amount;
        }
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        }
        if (order == 'count') {
            order = Sequelize.literal('count');
        }
        let filterRoleTypeOrganizationId = undefined;
        let conditionalUserCount;
        if (req.role_permission.role_type.code == 'organization') {
            filterRoleTypeOrganizationId = {
                role_type_id: req.role_permission.role_type_id
            };
            conditionalUserCount = [
                Sequelize.literal(
                    `(
                    SELECT COUNT(*)
                    FROM Users AS user
                    WHERE
                        user.organization_id = ` +
                        req.user.organization_id +
                        `
                        AND
                        user.role_id = ` +
                        'Role.id' +
                        `
                )`
                ),
                'count'
            ];
        } else {
            conditionalUserCount = [Sequelize.fn('COUNT', Sequelize.col('user.id')), 'count'];
        }

        let count = await Role.count({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        nameVi: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ],
                [Op.and]: [filterRoleTypeOrganizationId]
            },
            subQuery: false,
            attributes: ['id']
        });

        let data = await Role.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        nameVi: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ],
                [Op.and]: [filterRoleTypeOrganizationId]
            },
            subQuery: false,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                }
            ],
            attributes: {
                // include: [[Sequelize.fn("COUNT", Sequelize.col("user.id")), "count"]],
                include: [conditionalUserCount],
                exclude: ['user', 'role_type_id', 'description', 'status', 'createdAt', 'updatedAt']
            },
            limit: amount * 1,
            offset: page * amount,
            group: ['Role.id'],
            order: [[order, arrangement]]
        });

        return ReS(
            res,
            {
                count: count,
                data: data
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

exports.addPermission = async (req, res, next) => {
    try {
        // abc = new Role()
        // console.log("req.params.id-", req.params.id)
        // console.log("req.body-", req.body.id_permission)
        // req.body.id_permission.forEach(element => {
        //     rolePermissions = new RolePermissions()
        //     rolePermissions.permission_id = req.params.id
        //     rolePermissions.role_id = element
        //     rolePermissions.save()
        // });

        req.body.id_permission.forEach((element) => {
            roleNew = new RolePermissions();
            roleNew.permission_id = element;
            roleNew.role_id = req.params.id;
            roleNew.save();
        });

        res.status(200).json({
            status: 'success',
            data: 'data'
        });
    } catch (error) {
        next(error);
    }
};

// exports.getRole = async (req, res, next) => {
//     try {
//         if (!req.params.id) {
//             return ReE(res, "Bạn thiếu field", 400, contantStatus.errorCode.DataNull)
//         }
//        let data = await Role.findByPk(req.params.id,
//             {
//                 include: [{
//                     model: Permission,
//                     as: "permission",
//                     attributes: {
//                         exclude: ['createdAt', 'updatedAt', "RolePermissions"]
//                     },
//                     through: { attributes: [] },
//                 },{
//                     model: RolePermissionType,
//                     as: "role_permission_type",
//                     attributes: {
//                         exclude: ['createdAt', 'updatedAt', "role_id"]
//                     },
//                     include: [{
//                         model: PermissionSys,
//                         as: "permission_sys",
//                         attributes: {
//                             exclude: ['createdAt', 'updatedAt']
//                         },
//                         order: [
//                             ["id", "ASC"],
//                         ]
//                     }],
//                 }],
//                 attributes: {
//                     exclude: ['createdAt', 'updatedAt']
//                 },
//                 order: [
//                     ["id", "ASC"],
//                 ]
//             })
//         if (data)
//             return ReS(res, {
//                 data: data
//             }, 200);
//         else
//             return ReE(res, "role not found", 404, contantStatus.errorCode.NotFound)
//     } catch (error) {
//         next(error);
//     }
// };

exports.getPermissionTypeAndPermissionSys = async (req, res, next) => {
    try {
        let dataRolePerType = await RolePermissionType.findAll({
            include: [
                {
                    model: PermissionSys,
                    as: 'permission_sys',
                    where: {
                        role_id: 1
                    },
                    // attributes: {
                    //     exclude: ['createdAt', 'updatedAt','new','view','edit','delete',]
                    // },
                    attributes: ['role_permission_type_id', 'name', 'name_vi', 'description', 'code']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'ASC']]
        });

        if (dataRolePerType)
            return ReS(
                res,
                {
                    data: dataRolePerType
                },
                200
            );
    } catch (error) {
        next(error);
    }
};

exports.getRole = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }
        var data = await Role.findByPk(req.params.id, {
            include: [
                {
                    model: Permission,
                    as: 'permission',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                    },
                    through: { attributes: [] }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'ASC']]
        });

        let dataRolePerType = await RolePermissionType.findAll({
            include: [
                {
                    model: PermissionSys,
                    as: 'permission_sys',
                    where: {
                        role_id: req.params.id
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['id', 'ASC']]
        });
        data = JSON.parse(JSON.stringify(data, null, 4));
        data.role_permission_type = JSON.parse(JSON.stringify(dataRolePerType, null, 4));

        if (data)
            return ReS(
                res,
                {
                    data: data
                },
                200
            );
        else return ReE(res, 'role not found', 404, contantStatus.errorCode.NotFound);
    } catch (error) {
        next(error);
    }
};

exports.addRole = async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.nameVi) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }
        let role = await Role.findOne({
            where: {
                [Op.or]: [{ name: req.body.name }, { nameVi: req.body.nameVi }]
            }
        });
        if (role) {
            return ReE(res, 'role exists', 400, contantStatus.errorCode.Exist);
        }

        let roleNew = await Role.create({
            name: req.body.name,
            nameVi: req.body.nameVi,
            description: req.body.description,
            role_type_id: 4,
            status: true
        });

        if (req.body.permission) {
            for (var i = 0; i < req.body.permission.length; i++) {
                await RolePermissions.create({
                    role_id: roleNew.id,
                    permission_id: req.body.permission[i]
                });
            }
        }
        if (req.body.permission_sys) {
            for (var i = 0; i < req.body.permission_sys.length; i++) {
                let data_permission = req.body.permission_sys[i];
                await PermissionSys.create({
                    role_permission_type_id: data_permission.role_permission_type_id,
                    role_id: roleNew.id,
                    name: data_permission.name,
                    name_vi: data_permission.name_vi,
                    description: data_permission.description,
                    code: data_permission.code,
                    new: data_permission.new,
                    view: data_permission.view,
                    edit: data_permission.edit,
                    delete: data_permission.delete
                });
            }
        }
        // let err = {};
        // [err, data] = await to(Role.findByPk(1,
        //     {
        //         include: [{
        //             model: Permission,
        //             as: "permission",
        //             attributes: {
        //                 exclude: ['createdAt', 'updatedAt', "RolePermissions"]
        //             },
        //             through: { attributes: [] },
        //         }],
        //         attributes: {
        //             exclude: ['createdAt', 'updatedAt']
        //         },
        //     }))
        return ReS(
            res,
            {
                data: { role_id: roleNew.id },
                message: 'Thêm thành công'
            },
            200
        );
    } catch (error) {
        next(error);
    }
};

exports.updateRole = async (req, res, next) => {
    try {
        // const { name, name_vi, point_marker_id } = req.body;
        let { permission, permission_sys } = req.body;
        const role_id = req.params.id;
        if (!req.body.name || !req.body.nameVi) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }

        let role = await Role.findOne({
            where: { id: req.params.id }
        });
        if (!role) {
            return ReE(res, 'role not found', 404, contantStatus.errorCode.NotFound);
        }
        if (req.body.name != role.dataValues.name && req.body.nameVi != role.dataValues.nameVi) {
            let check = await Role.findOne({
                where: {
                    [Op.or]: [{ name: req.body.name }, { nameVi: req.body.nameVi }]
                }
            });
            if (check) {
                return ReE(res, 'role name exists', 400, contantStatus.errorCode.Exist);
            }
        } else if (req.body.name != role.dataValues.name) {
            let check = await Role.findOne({
                where: {
                    name: req.body.name
                }
            });
            if (check) {
                return ReE(res, 'role name exists', 400, contantStatus.errorCode.Exist);
            }
        } else if (req.body.nameVi != role.dataValues.nameVi) {
            let check = await Role.findOne({
                where: {
                    nameVi: req.body.nameVi
                }
            });
            if (check) {
                return ReE(res, 'role name exists', 400, contantStatus.errorCode.Exist);
            }
        }

        role.name = req.body.name;
        role.nameVi = req.body.nameVi;
        role.description = req.body.description;
        // role.status = req.body.status
        role.save();
        // const doc = await Role.update(role.dataValues, { where: { id: req.params.id } });
        // if (doc == false) {
        //     return ReE(res, "Update không thành công", 404, contantStatus.errorCode.NotFound)
        // }
        if (!permission || permission.length == 0) {
            await RolePermissions.destroy({
                where: { role_id: req.params.id }
            });
        } else {
            let dataPointMarker = await RolePermissions.findAll({
                where: { role_id: req.params.id },
                raw: true,
                attributes: ['id', 'permission_id']
            });
            //dataPointMarker k có gì, per có
            if (dataPointMarker.length == 0 && permission) {
                for (var i = 0; i < permission.length; i++) {
                    await RolePermissions.create({
                        role_id: role_id,
                        permission_id: permission[i]
                    });
                }
            } else {
                dataPointMarker.forEach((element) => {
                    if (!permission.includes(element.permission_id)) {
                        RolePermissions.destroy({
                            where: { id: element.id }
                        });
                    } else {
                        permission = permission.filter((e) => e !== element.permission_id);
                    }
                });
                if (permission.length != 0) {
                    for (var i = 0; i < permission.length; i++) {
                        await RolePermissions.create({
                            role_id: req.params.id,
                            permission_id: permission[i]
                        });
                    }
                }
            }
        }

        if (permission_sys) {
            for (let i = 0; i < permission_sys.length; i++) {
                await PermissionSys.update(
                    {
                        new: permission_sys[i].new,
                        view: permission_sys[i].view,
                        edit: permission_sys[i].edit,
                        delete: permission_sys[i].delete
                    },
                    { where: { id: permission_sys[i].id } }
                );
            }
        }
        return ReS(res, { message: 'Update thành công' });
    } catch (error) {
        next(error);
    }
};

exports.deleteRole = async (req, res, next) => {
    try {
        let data = await Role.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id']
                }
            ],
            attributes: {
                include: [[Sequelize.fn('COUNT', Sequelize.col('user.id')), 'count']],
                exclude: ['user', 'createdAt', 'updatedAt']
            }
        });
        if (data.id == null) {
            return ReE(res, 'role not found', 404, contantStatus.errorCode.NotFound);
        }
        if (data.dataValues.count > 0) {
            return ReE(res, 'dont delete', 405, contantStatus.errorCode.CanNot);
        }
        if (data.is_default == true) {
            return ReE(res, 'dont delete, default', 405, contantStatus.errorCode.CanNot);
        }
        await RolePermissions.destroy({
            where: { role_id: req.params.id }
        });
        await PermissionSys.destroy({
            where: { role_id: req.params.id }
        });
        let checkdelete = await Role.destroy({
            where: { id: req.params.id }
        });
        if (checkdelete)
            return ReS(
                res,
                {
                    message: 'Xóa thành công'
                },
                200
            );
        return ReE(res, 'Xóa không thành công', 404, contantStatus.errorCode.NotFound);
    } catch (error) {
        next(error);
    }
};

exports.getRoleIncludePermission = async (req, res, next) => {
    try {
        let data = await Role.findByPk(req.params.id, {
            include: [
                {
                    model: Permission,
                    as: 'permission',
                    // attributes: ["title", "description"]
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'RolePermissions']
                    },
                    through: { attributes: [] }
                }
            ],
            // include: ['permission'],
            // through: { attributes: [] },
            // attributes: ['title', 'description'],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });

        res.status(200).json({
            status: 'success',
            data: data
        });
    } catch (error) {
        next(error);
    }
};
