module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'MentorRegistration',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            create_by_user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            status_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                defaultValue: 1
            },
            reason_register: DataTypes.STRING,
            connection_method: DataTypes.STRING,
            connection_link: DataTypes.STRING,
            feedback: DataTypes.STRING,
            feedback_by_user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            }
        },
        {
            tableName: 'mentor_registration'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'create_by_user_id', as: 'create_by_user' });
        Model.belongsTo(models.User, { foreignKey: 'feedback_by_user_id', as: 'feedback_by_user' });
        Model.belongsTo(models.MentorRegistrationStatus, { foreignKey: 'status_id', as: 'status' });
        Model.belongsToMany(models.ConsultingField, {
            through: 'MentorRegistrationConsultingField',
            foreignKey: 'mentor_registration_id',
            otherKey: 'consulting_field_id',
            as: 'consulting_field',
            attributes: []
        });
    };
    return Model;
};
