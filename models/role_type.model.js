module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'RoleType',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            code: DataTypes.STRING
        },
        {
            tableName: 'role_type'
        }
    );
    Model.associate = function (models) {
        Model.hasMany(models.Role, { foreignKey: 'role_type_id', as: 'role' });
    };
    return Model;
};
