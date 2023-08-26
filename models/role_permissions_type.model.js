const Permission = require('./permission.model');
const Role = require('./role.model');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RolePermissionType',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            name_vi: DataTypes.STRING
        },
        {
            tableName: 'role_permission_type'
        }
    );
    Model.associate = function (models) {
        // Model.belongsTo(models.Role, { foreignKey: 'role_id' })
        Model.hasMany(models.PermissionSys, { foreignKey: 'role_permission_type_id', as: 'permission_sys' });
    };
    return Model;
};
