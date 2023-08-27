module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'MentorRegistrationStatus',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name_en: DataTypes.STRING,
            name_vi: DataTypes.STRING,
            status_code: DataTypes.STRING,
            describe: DataTypes.STRING
        },
        {
            tableName: 'mentor_registration_status'
        }
    );
    Model.associate = function (models) {
        Model.hasMany(models.MentorRegistration, {
            foreignKey: 'status_id',
            as: 'mentor_registration'
        });
    };
    return Model;
};
