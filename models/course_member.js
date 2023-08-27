module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'CourseMember',
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
            course_id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            fullname: DataTypes.STRING,
            phone: {
                type: DataTypes.STRING,
                validate: {
                    len: [10, 10]
                }
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    len: [0, 50]
                }
            },
            CMND: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
                validate: {
                    len: [12, 12]
                }
            },
            skypelink: {
                type: DataTypes.STRING
            },
            //dia chi cua nguoi dang ky khao hoc
            address: {
                type: DataTypes.STRING,
                validate: {
                    len: [0, 100]
                }
            },
            // truong ban dang hoc
            school: {
                type: DataTypes.STRING,
                validate: {
                    len: [0, 50]
                }
            },
            // chuyen nganh theo hoc
            majors: {
                type: DataTypes.STRING
            },
            // nam hoan thanh chung trinh hoc o truong
            graduation_year: {
                type: DataTypes.STRING
            },
            // ly do tham gia khoa hoc
            reason: {
                type: DataTypes.STRING
            }
        },
        {
            tableName: 'course_member'
        }
    );
    Model.associate = function (models) {
        Model.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' });
        Model.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    };
    return Model;
};
