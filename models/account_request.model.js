module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'AccountRequest',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            fullname: DataTypes.STRING,
            select_username: {
                type: DataTypes.STRING,
                defaultValue: 'email'
            },
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            },
            password: DataTypes.STRING,
            confirmed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            code_otp_confirm: DataTypes.STRING,
            codeconfirm: DataTypes.STRING,
            active_day: DataTypes.STRING,
            create_by: DataTypes.STRING,
            language: { type: DataTypes.STRING, defaultValue: 'en' }
        },
        {
            tableName: 'account_request'
        }
    );
    return Model;
};
