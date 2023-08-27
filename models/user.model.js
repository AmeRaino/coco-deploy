const validator = require('validator');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const CONFIG = require('../config/config');
const { ENUM } = require('sequelize');
const Role = require('./role.model');
// const UserConsultingField = require("./user_certificate.model");

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            fullname: DataTypes.STRING,
            gender: DataTypes.BOOLEAN,
            birthday: {
                type: DataTypes.DATEONLY
            },
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
            address: DataTypes.STRING,
            password: DataTypes.STRING,
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            activeDay: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
            codeconfirm: DataTypes.STRING,
            code_otp_confirm: DataTypes.STRING,
            avatar: DataTypes.STRING,
            connection_image: DataTypes.STRING,
            job: DataTypes.STRING,
            introduce_yourself: DataTypes.STRING,
            language: { type: DataTypes.STRING, defaultValue: 'vi' },
            ward_id: {
                type: DataTypes.INTEGER
            },
            create_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            role_id: {
                type: DataTypes.INTEGER,
                defaultValue: 5
            },
            organization_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            connection_count: {
                type: DataTypes.INTEGER
                // allowNull: false,
                // defaultValue: 10
            },
            connection_count_default: {
                type: DataTypes.INTEGER
            },
            reason_register: DataTypes.STRING,
            is_removed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            tableName: 'user'
        }
    );

    Model.beforeSave(async (user, options) => {
        if (user.changed('password')) {
            // let salt, hash;
            // [err, salt] = await bcrypt.genSalt(10);
            // if (err)
            //   console.log("---errerrerrerrerrerrerrerrerrerrerrerrerr", err)
            // console.log("---", salt)
            // Hashing the password
            user.password = await bcrypt.hash(user.password, 12);
        }
        // Delete passwordConfirm field
        // user.passwordConfirm = undefined;
    });

    Model.prototype.correctPassword = async function (typedPassword, originalPassword) {
        return await bcrypt.compare(typedPassword, originalPassword);
    };

    Model.associate = function (models) {
        Model.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
        Model.belongsTo(models.Ward, { foreignKey: 'ward_id', as: 'ward' });
        Model.belongsTo(models.Organization, {
            foreignKey: 'organization_id',
            as: 'organization'
        });
        Model.hasMany(models.UserReviews, {
            foreignKey: 'user_id',
            as: 'user_reviews'
        });
        Model.hasMany(models.UserEducation, {
            foreignKey: 'user_id',
            as: 'user_education'
        });
        Model.hasMany(models.UserSkill, {
            foreignKey: 'user_id',
            as: 'user_skill'
        });
        Model.hasMany(models.UserPrize, {
            foreignKey: 'user_id',
            as: 'user_prize'
        });
        Model.hasMany(models.UserExtracurricularActivities, {
            foreignKey: 'user_id',
            as: 'user_extracurricular_activities'
        });
        Model.hasMany(models.UserExperience, {
            foreignKey: 'user_id',
            as: 'user_experience'
        });
        Model.hasMany(models.UserCertificate, {
            foreignKey: 'user_id',
            as: 'user_certificate'
        });
        Model.hasMany(models.UserConsultingField, {
            foreignKey: 'user_id',
            as: 'user_consulting_field'
        });
        Model.hasMany(models.UserConnection, {
            foreignKey: 'created_by_user_id',
            as: 'user_connection_created_by'
        });
        Model.hasMany(models.UserConnection, {
            foreignKey: 'connected_user_id',
            as: 'user_connection_connected'
        });
        Model.hasMany(models.UserAppointment, {
            foreignKey: 'with_mentor_id',
            as: 'with_mentor'
        });
        Model.hasMany(models.UserAppointment, {
            foreignKey: 'create_by_mentee_id',
            as: 'with_mentee'
        });
        Model.hasMany(models.UserDeviceToken, {
            foreignKey: 'user_id',
            as: 'user_device_token'
        });
        Model.belongsToMany(models.ConsultingField, {
            through: 'UserConsultingField',
            foreignKey: 'user_id',
            otherKey: 'consulting_field_id',
            as: 'consulting_field',
            attributes: []
        });
        Model.belongsToMany(models.Notification, {
            through: 'UserNotification',
            foreignKey: 'user_id',
            otherKey: 'notification_id',
            as: 'notification',
            attributes: []
        });
        Model.hasMany(models.Notification, {
            foreignKey: 'created_user_id',
            as: 'created_notification'
        });
        Model.hasOne(models.OnlineStatus, {
            foreignKey: 'userId',
            as: 'online_status'
        });
        Model.hasMany(models.UserTodoList, {
            foreignKey: 'user_id',
            as: 'user_todo_list'
        });
        Model.hasMany(models.MentorRegistration, {
            foreignKey: 'create_by_user_id',
            as: 'mentor_registration_create_by_user'
        });
        Model.hasMany(models.MentorRegistration, {
            foreignKey: 'feedback_by_user_id',
            as: 'mentor_registration_feedback_by_user'
        });
        Model.hasMany(models.Course, {
            foreignKey: 'teacher_id',
            as: 'course'
        });
        Model.hasMany(models.UserMobileNotification, {
            foreignKey: 'user_id',
            as: 'user_mobile_notification'
        });
        Model.hasMany(models.Blog, {
            foreignKey: 'created_user_id',
            as: 'blog'
        });
        Model.hasMany(models.CourseMember, {
            foreignKey: 'user_id',
            as: 'course_member'
        });
    };

    return Model;
};
