const Role = require('./role.model');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Permission', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        nameVi: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        code: DataTypes.STRING
    });
    Model.associate = (models) => {
        // eslint-disable-line no-unused-vars
        Model.belongsToMany(models.Role, {
            through: 'RolePermissions',
            foreignKey: 'permission_id',
            as: 'role'
        });
    };

    return Model;
};
