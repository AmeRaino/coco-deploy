module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'ConsultingField',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name_en: DataTypes.STRING,
            name_vi: DataTypes.STRING
        },
        {
            tableName: 'consulting_field'
        }
    );
    Model.associate = function (models) {
        Model.belongsToMany(models.User, {
            through: 'UserConsultingField',
            foreignKey: 'consulting_field_id',
            other_key: 'user_id',
            as: 'user',
            attributes: []
        });
        Model.hasMany(models.Course, { foreignKey: 'consulting_field_id', as: 'course' });
        Model.belongsToMany(models.MentorRegistration, {
            through: 'MentorRegistrationConsultingField',
            foreignKey: 'consulting_field_id',
            otherKey: 'mentor_registration_id',
            as: 'mentor_registration',
            attributes: []
        });
    };
    return Model;
};
