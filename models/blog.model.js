module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Blog',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            content: {
                type: DataTypes.STRING(10000),
                allowNull: false
            },
            created_user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            create_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            thumbnail: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            }
        },
        {
            tableName: 'blog'
        }
    );

    Model.associate = function (models) {
        Model.belongsTo(models.User, {
            foreignKey: 'created_user_id',
            as: 'user'
        });
    }

    return Model;
}