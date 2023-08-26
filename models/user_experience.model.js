module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserExperience',
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
                type: DataTypes.INTEGER
            },
            company_name: DataTypes.STRING,
            start_time: DataTypes.STRING,
            end_time: DataTypes.STRING,
            working_position: DataTypes.STRING,
            until_now: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            job_description: DataTypes.STRING
        },
        {
            tableName: 'user_experience'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Model.belongsTo(models.ConsultingField, { foreignKey: 'consulting_field_id', as: 'consulting_field' });
    };
    return Model;
};
