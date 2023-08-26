const Permission = require('./permission.model');
const User = require('./user.model');
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Role',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            nameVi: DataTypes.STRING,
            description: DataTypes.STRING,
            status: DataTypes.BOOLEAN,
            is_default: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            role_type_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'role'
        }
    );
    Model.associate = (models) => {
        // eslint-disable-line no-unused-vars
        Model.belongsToMany(models.Permission, {
            through: 'RolePermissions',
            foreignKey: 'role_id',
            as: 'permission',
            attributes: []
        });
        Model.hasMany(models.User, { foreignKey: 'role_id', as: 'user' });
        // Model.hasMany(models.RolePermissionType, { foreignKey: 'id', as: 'role_permission_type' })
        // Model.hasMany(models.RolePermissionType, { foreignKey: 'role_id', as: 'role_permission_type' })
        Model.hasMany(models.PermissionSys, { foreignKey: 'role_id', as: 'permission_sys' });
        Model.belongsTo(models.RoleType, { foreignKey: 'role_type_id', as: 'role_type' });
    };
    return Model;
};
