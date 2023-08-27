module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Ward',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            district_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            name_vi: DataTypes.STRING,
            name_en: DataTypes.STRING
        },
        {
            tableName: 'ward'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.District, { foreignKey: 'district_id', as: 'district' });
    };
    return Model;
};
