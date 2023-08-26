const Permission = require('./permission.model');
const Role = require('./role.model');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RolePermissions',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            permission_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'role_permissions'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.Role, { foreignKey: 'role_id' });
        Model.belongsTo(models.Permission, { foreignKey: 'permission_id' });
    };
    return Model;
};
