module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'UserCertificate',
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
            certificate: DataTypes.STRING,
            describe: DataTypes.STRING,
            received_date: DataTypes.STRING
        },
        {
            tableName: 'user_certificate'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
