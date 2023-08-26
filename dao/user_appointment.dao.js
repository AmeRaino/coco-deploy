import { min } from 'lodash';
import { User, UserAppointmentSetting, UserRequestAppointment, UserAppointment } from '../models';
const { Op, Sequelize } = require('sequelize');
const moment = require('moment');

//Mentor appointment setting
export async function createUserAppointmentSetting(userId, bodyReq) {
    try {
        const result = await UserAppointmentSetting.create({
            user_id: userId,
            day_of_week: bodyReq.day_of_week,
            start_time: bodyReq.start_time,
            end_time: bodyReq.end_time,
            connection_method: bodyReq.connection_method,
            connection_link: bodyReq.connection_link
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createUserAppointmentSetting()`);
    }
}

export async function updateUserAppointmentSetting(id, bodyReq) {
    try {
        const result = await UserAppointmentSetting.update(
            {
                day_of_week: bodyReq.day_of_week,
                start_time: bodyReq.start_time,
                end_time: bodyReq.end_time,
                connection_method: bodyReq.connection_method,
                connection_link: bodyReq.connection_link
            },
            {
                where: { id: id }
            }
        );
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback updateUserAppointmentSetting()`);
    }
}

export async function findAllAppointmentSettingByUserId(userId) {
    try {
        const result = await UserAppointmentSetting.findAll({
            where: {
                user_id: userId
            }
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllAppointmentSettingByUserId()`);
    }
}

export async function deleteUserAppointmentSetting(id) {
    try {
        const check = await UserAppointmentSetting.destroy({
            where: { id: id }
        });
        return check;
    } catch (error) {
        throw new Error(`${error}, traceback deleteUserAppointmentSetting()`);
    }
}

// Request Appointment
export async function createRequestAppointment(createByMenteeId, bodyReq, status) {
    try {
        let now = new Date(Date.now());
        // console.log('now', now);
        // let start_time = new Date(Date.parse(`${bodyReq.date.split(' ')[0]}`+ ' ' + `${bodyReq.start_time}`));
        let start_time = new Date(`${bodyReq.date.split(' ')[0]} ` + `${bodyReq.start_time}`);
        // let end_time = Date.parse(bodyReq.date.split(' ')[0]+ ' ' + bodyReq.end_time);
        // console.log(start_time, end_time);
        // console.log(start_time < now);
        // console.log(bodyReq.date, moment(start_time).format('YYYY-MM-DD HH:mm:ss'), moment(end_time).format('YYYY-MM-DD HH:mm:ss'));
        if (now < start_time) {
            const result = await UserRequestAppointment.create({
                create_by_mentee_id: createByMenteeId,
                date: bodyReq.date,
                start_time: bodyReq.start_time,
                end_time: bodyReq.end_time,
                connection_method: bodyReq.connection_method,
                connection_link: bodyReq.connection_link,
                message: bodyReq.message,
                status: status,
                with_mentor_id: bodyReq.with_mentor_id
            });
            return result;
        }
    } catch (error) {
        throw new Error(`${error}, traceback createRequestAppointment()`);
    }
}

export async function findAllRequestAppointmentByUserId(userId, status) {
    try {
        const result = await UserRequestAppointment.findAll({
            where: {
                with_mentor_id: userId,
                status: status
            },
            include: [
                {
                    model: User,
                    as: 'create_by_mentee',
                    attributes: ['fullname', 'avatar', "gender"]
                }
            ],
            order: [["id", "DESC"]]
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllRequestAppointmentByUserId()`);
    }
};

export async function findAllRequestAppointmentCreatedByMenteeId(menteeId) {
    try {
        const result = await UserRequestAppointment.findAll({
            where: {
                create_by_mentee_id: menteeId,
                [Op.or]: [
                    {
                        status: 'ACCEPT'
                    },
                    {
                        status: 'NEW'
                    }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'create_by_mentee',
                    attributes: ['fullname', 'avatar', "gender"]
                }
            ],
            order: [["id", "DESC"]]
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllRequestAppointmentCreatedByMenteeId()`);
    }
};

export async function updateStatusRequestAppointment(id, status) {
    try {
        const result = await UserRequestAppointment.update(
            {
                status: status
            },
            {
                where: { id: id }
            }
        );
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback updateUserAppointmentSetting()`);
    }
}

export async function findOneRequestAppointment(id) {
    try {
        const result = await UserRequestAppointment.findByPk(id);
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findOneRequestAppointment()`);
    }
}

// User appointment
export async function createUserAppointment(createByMenteeId, bodyReq) {
    try {
        //console.log("ss", new Date(bodyReq.date + ' ' + bodyReq.start_time + '-7000'))// đúng dữ liệu khi tạo nhưng khi add db bị +7h => sai
        //console.log("ss", new Date(bodyReq.date + ' ' + bodyReq.start_time ))// trừ dữ liệu 7h nhưng khi add db +7 => đúng
        let date = new Date(bodyReq.date + ' ' + bodyReq.start_time )
        const result = await UserAppointment.create({
            create_by_mentee_id: createByMenteeId,
            date: date.setTime( date.getTime() -  7*60*60*1000 ),
            start_time: bodyReq.start_time,
            end_time: bodyReq.end_time,
            connection_method: bodyReq.connection_method,
            connection_link: bodyReq.connection_link,
            message: bodyReq.message,
            with_mentor_id: bodyReq.with_mentor_id
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback createUserAppointment()`);
    }
}

export async function findAllUserAppointmentUpcomingByMentorId(mentorId) {
    try {
        const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const result = await UserAppointment.findAll({
            where: {
                with_mentor_id: mentorId,
                date: { [Op.gt]: date }
            },
            order: [['date']],
            include: [
                {
                    model: User,
                    as: 'create_by_mentee',
                    attributes: ['fullname']
                }
            ]
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllUserAppointmentUpcomingByMentorId()`);
    }
}

export async function findAllUserAppointmentCompleteByMentorId(mentorId) {
    try {
        const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const result = await UserAppointment.findAll({
            where: {
                with_mentor_id: mentorId,
                date: { [Op.lte]: date }
            },
            order: [['date', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'create_by_mentee',
                    attributes: ['fullname']
                }
            ]
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllUserAppointmentCompleteByMentorId()`);
    }
}

export async function findAllUserAppointmentUpcomingByMenteeId(menteeId) {
    try {
        const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        const result = await UserAppointment.findAll({
            where: {
                create_by_mentee_id: menteeId,
                date: { [Op.gt]: date }
            },
            include: [
                {
                    model: User,
                    as: 'with_mentor',
                    attributes: ['fullname']
                }
            ]
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllUserAppointmentUpcomingByMentorId()`);
    }
}

export async function findAllUserAppointmentCompleteByMenteeId(menteeId) {
    try {
        const date = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        // console.log(date);
        // console.log(dateNow.toString('yyyy-mm-dd hh:mm:ss'));
        // console.log((dateNow).toISOString().slice(0,10) + ' ' + dateNow.toLocaleTimeString());
        // console.log(dateNow);
        const result = await UserAppointment.findAll({
            where: {
                create_by_mentee_id: menteeId,
                date: { [Op.lte]: date }
            },
            include: [
                {
                    model: User,
                    as: 'with_mentor',
                    attributes: ['fullname']
                }
            ]
        });
        // console.log((dateNow));
        // console.log(result[0].dataValues.date);
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllUserAppointmentCompleteByMentorId()`);
    }
}

export async function findAllUserAppointmentUpcomingOfMonthByMentorId(mentorId, month, year) {
    try {
        const result = await UserAppointment.findAll({
            where: {
                with_mentor_id: mentorId,
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('date')), month),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('date')), year)
                ]
                // date: { [Op.gt]: dateNow }
            },
            attributes: ['id', 'date', 'start_time', 'end_time', [Sequelize.fn('date_format', Sequelize.col('date'), '%Y-%m-%d'), 'date_col_formed']],
            order: ['date']
        });
        return result;
    } catch (error) {
        throw new Error(`${error}, traceback findAllUserAppointmentUpcomingOfMonthByMentorId()`);
    }
}
