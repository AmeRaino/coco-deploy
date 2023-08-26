module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserConsultingField',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            consulting_field_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'user_consulting_field'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Model.belongsTo(models.ConsultingField, { foreignKey: 'consulting_field_id', as: 'consulting_field' });
    };
    return Model;
};
