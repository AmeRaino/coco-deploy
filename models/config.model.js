import config from '../config/config';

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Config',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                require: true
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: false,
                // defaultValue: config.swipe_number
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            tableName: 'config'
        }
    );
    return Model;
};
