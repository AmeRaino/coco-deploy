const { Permission } = require('../models');
const base = require('./baseController');
const PermissionConstant = require('../constants/PermissionConstant');

exports.getAllPermissions = base.getAll(Permission);

exports.getPermission = base.getOne(Permission);
exports.createPermission = base.createOne(Permission);
exports.deletePermission = base.deleteOne(Permission);
exports.updatePermission = base.updateOne(Permission);

exports.createDefaultPermissions = async () => {
    const permission = await Permission.findAll();
    if (permission.length == 0) {
        for (const [key, value] of Object.entries(PermissionConstant)) {
            Permission.create(value);
        }
    }
};
