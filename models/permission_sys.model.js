const Role = require('./role.model');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'PermissionSys',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            role_permission_type_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            role_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            name: DataTypes.STRING,
            name_vi: DataTypes.STRING,
            description: DataTypes.STRING,
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            code: DataTypes.STRING,
            new: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            view: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            edit: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            delete: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false
            }
        },
        {
            tableName: 'permission_sys'
        }
    );
    // Model.associate = (models) => { // eslint-disable-line no-unused-vars
    //   Model.belongsToMany(models.Role, {
    //     through: 'RolePermissions',
    //     foreignKey: 'permission_id',
    //     as: 'role'
    //   })
    // };
    Model.associate = function (models) {
        Model.belongsTo(models.RolePermissionType, { foreignKey: 'role_permission_type_id' });
        Model.belongsTo(models.Role, { foreignKey: 'role_id' });
    };
    return Model;
};
