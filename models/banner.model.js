module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Banner',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            banner_name: {
                type: DataTypes.STRING(50)
            },
            banner_directory: {
                type: DataTypes.STRING
            },
            banner_url: {
                type: DataTypes.STRING
            },
            ordinal_number: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.BOOLEAN
            },
            type: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'banner'
        }
    );

    return Model;
};
