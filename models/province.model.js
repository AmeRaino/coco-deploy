module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Province',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name_vi: DataTypes.STRING,
            name_en: DataTypes.STRING
        },
        {
            tableName: 'province'
        }
    );
    Model.associate = function (models) {
        Model.hasMany(models.District, { foreignKey: 'province_id', as: 'province' });
    };
    return Model;
};
