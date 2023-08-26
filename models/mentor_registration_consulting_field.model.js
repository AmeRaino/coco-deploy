module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'MentorRegistrationConsultingField',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            mentor_registration_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            consulting_field_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: 'mentor_registration_consulting_field',
            uniqueKeys: {
                actions_unique: {
                    fields: ['id', 'mentor_registration_id', 'consulting_field_id']
                }
            }
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.MentorRegistration, { foreignKey: 'mentor_registration_id', as: 'mentor_registration' });
        Model.belongsTo(models.ConsultingField, { foreignKey: 'consulting_field_id', as: 'consulting_field' });
    };
    return Model;
};
