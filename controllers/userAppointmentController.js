import { to, ReE, ReS, TE } from '../utils/util.service';
import { getTranslate } from '../utils/translate';
import { errorCode, successCode } from '../utils/util.helper';
import {
    createUserAppointmentSetting,
    updateUserAppointmentSetting,
    deleteUserAppointmentSetting,
    findAllAppointmentSettingByUserId,
    findAllRequestAppointmentByUserId,
    findOneRequestAppointment,
    updateStatusRequestAppointment,
    createUserAppointment,
    findAllUserAppointmentCompleteByMentorId,
    findAllUserAppointmentUpcomingByMentorId,
    findAllUserAppointmentUpcomingOfMonthByMentorId,
    findAllUserAppointmentCompleteByMenteeId,
    findAllUserAppointmentUpcomingByMenteeId
} from '../dao/user_appointment.dao';
import { findOneUser } from '../dao/user.dao';
import { acceptRequestNotification, refuseRequestNotification } from '../lib/firebase_fcm';
import { User } from '../models';
const RequestAppointmentConstant = require('../constants/RequestAppointmentConstant');
const RoleConstant = require('../constants/RoleConstant');

export async function getAllAppointmentSetting(req, res, next) {
    try {
        let data = await findAllAppointmentSettingByUserId(req.user.id);
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function updateAppointmentSetting(req, res, next) {
    try {
        const doc = await updateUserAppointmentSetting(req.params.id, req.body);

        if (doc == false) {
            return ReE(res, getTranslate('Update Data Fail', req.user.language), 404, errorCode.NotFound);
        }

        return ReS(
            res,
            {
                message: getTranslate('Update Data Success', req.user.language)
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function createAppointmentSetting(req, res, next) {
    try {
        const data = await createUserAppointmentSetting(req.user.id, req.body);

        if (data)
            return ReS(
                res,
                {
                    data,
                    message: getTranslate('Create Data Success', req.user.language)
                },
                200
            );
        return ReE(res, getTranslate('Create Data Fail', req.user.language), 400, errorCode.Exception);
    } catch (error) {
        next(error);
    }
}

export async function deleteAppointmentSetting(req, res, next) {
    try {
        const data = await deleteUserAppointmentSetting(req.params.id);

        if (data)
            return ReS(
                res,
                {
                    message: getTranslate('Delete Data Success', req.user.language)
                },
                200
            );
        return ReE(res, getTranslate('Delete Data Fail', req.user.language), 400, errorCode.Exception);
    } catch (error) {
        next(error);
    }
}

//Request appointment
export async function getAllRequestAppointmentNew(req, res, next) {
    try {
        let data = await findAllRequestAppointmentByUserId(req.user.id, RequestAppointmentConstant.NEW.code);
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function refuseRequestAppointment(req, res, next) {
    try {
        const doc = await updateStatusRequestAppointment(req.params.id, RequestAppointmentConstant.REFUSE.code);
        const appointment = await findOneRequestAppointment(req.params.id);
        // console.log(appointment.dataValues);

        if (doc == false) {
            return ReE(res, getTranslate('Refuse Request Fail', req.user.language), 404, errorCode.NotFound);
        }

        else {
            const receivedUser = await User.findOne({
                where: {
                    id: appointment.dataValues.create_by_mentee_id
                }
            });
            const sendDate = new Date(Date.now() + 7 * (60 * 60 * 1000));
            refuseRequestNotification(appointment.dataValues.create_by_mentee_id, appointment.dataValues.with_mentor_id, 'appointment', receivedUser.language, sendDate);
            return ReS(
                res,
                {
                    message: getTranslate('Refuse Request Success', req.user.language)
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
}

export async function acceptRequestAppointment(req, res, next) {
    try {
        const data = await findOneRequestAppointment(req.params.id);
        if (!data) {
            return ReE(res, 'Data not found', 400, errorCode.NotFound);
        }

        const doc = await updateStatusRequestAppointment(req.params.id, RequestAppointmentConstant.ACCEPT.code);
        if (doc == false) {
            return ReE(res, getTranslate('Approve Request Fail', req.user.language), 404, errorCode.NotFound);
        }
        else {
            await createUserAppointment(data.create_by_mentee_id, data);
            const receivedUser = await User.findOne({
                where: {
                    id: data.dataValues.create_by_mentee_id
                }
            });
            const sendDate = new Date(Date.now() + 7 * (60 * 60 * 1000));
            await acceptRequestNotification(data.dataValues.create_by_mentee_id, data.dataValues.with_mentor_id, 'appointment', receivedUser.language, sendDate);
    
            return ReS(
                res,
                {
                    message: getTranslate('Approve Request Success', req.user.language)
                },
                200
            );
        }
    } catch (error) {
        next(error);
    }
}

//User appointment
export async function getAllUserAppointmentReady(req, res, next) {
    try {
        let start = Date.now();
        let userId = req.params.id;

        let { month, year } = req.query;
        if (!month || !year) {
            return ReE(res, 'Bạn thiếu field', 400, errorCode.DataNull);
        }
        const dataUser = await findOneUser(userId);
        if (!dataUser) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }

        let dateNow = new Date(Date.now() + 7 * (60 * 60 * 1000));
        if ((month - 1 < dateNow.getMonth() && year == dateNow.getFullYear()) || year < dateNow.getFullYear()) {
            return ReE(res, getTranslate('Invalid Data', req.user.language), 404, errorCode.InvalidData);
        }

        // let dateMonth = (new Date(year, month-1, 1, 0, 0, 0, 0)).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        let dateMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
        console.log('dateMonth', dateMonth);
        let dataAppointmentSetting = await findAllAppointmentSettingByUserId(userId);
        let arrDayOfWeek = []; //['MONDAY','TUESDAY']
        let arrObjectDayOfWeek = {
            MONDAY: [],
            TUESDAY: [],
            WEDNESDAY: [],
            THURSDAY: [],
            FRIDAY: [],
            SATURDAY: [],
            SUNDAY: []
        };

        dataAppointmentSetting.forEach((element) => {
            if (arrDayOfWeek.indexOf(element.day_of_week) === -1) {
                arrDayOfWeek.push(element.day_of_week);
            }
            switch (element.day_of_week) {
                case 'MONDAY':
                    arrObjectDayOfWeek.MONDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                case 'TUESDAY':
                    arrObjectDayOfWeek.TUESDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                case 'WEDNESDAY':
                    arrObjectDayOfWeek.WEDNESDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                case 'THURSDAY':
                    arrObjectDayOfWeek.THURSDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                case 'FRIDAY':
                    arrObjectDayOfWeek.FRIDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                case 'SATURDAY':
                    arrObjectDayOfWeek.SATURDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                case 'SUNDAY':
                    arrObjectDayOfWeek.SUNDAY.push({
                        start_time: element.start_time,
                        end_time: element.end_time,
                        connection_method: element.connection_method,
                        connection_link: element.connection_link
                    });
                    break;
                default:
                    break;
            }
        });
        let { mondays, tuesdays, wednesdays, thursday, fridays, saturdays, sundays } = getDateByDayOfWeek(dateMonth);
        // let dateByDayOfWeek = getDateByDayOfWeek(dateMonth)

        let dataAppointmentUpcoming = await findAllUserAppointmentUpcomingOfMonthByMentorId(userId, month, year);
        dataAppointmentUpcoming = JSON.parse(JSON.stringify(dataAppointmentUpcoming, null, 4));

        let data = [];
        arrDayOfWeek.forEach((element) => {
            switch (element) {
                case 'MONDAY':
                    mondays.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.MONDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                case 'TUESDAY':
                    tuesdays.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.TUESDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                case 'WEDNESDAY':
                    wednesdays.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.WEDNESDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                case 'THURSDAY':
                    thursday.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.THURSDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                case 'FRIDAY':
                    fridays.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.FRIDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                case 'SATURDAY':
                    saturdays.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.SATURDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                case 'SUNDAY':
                    sundays.forEach((elementDate) => {
                        let time = [];
                        arrObjectDayOfWeek.SUNDAY.forEach((elementDateSeting) => {
                            //kiểm tra lịch setting có trùng lịch tương lai không
                            let checkDuplicate = false; // lịch setting trùng vs lịch tương lai, nêu false thì đc vào lịch hẹn, nếu có thì bỏ qua
                            dataAppointmentUpcoming.forEach((elementDateUpcoming) => {
                                if (elementDate == elementDateUpcoming.date_col_formed)
                                    if (
                                        elementDateUpcoming.start_time == elementDateSeting.start_time || // bắt đầu bằng nhau
                                        (elementDateUpcoming.start_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.start_time < elementDateSeting.end_time) || // start upcoming nằm trong setting
                                        (elementDateUpcoming.end_time > elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time < elementDateSeting.end_time) || // end upcoming nằm trong setting
                                        (elementDateUpcoming.start_time < elementDateSeting.start_time &&
                                            elementDateUpcoming.end_time > elementDateSeting.start_time)
                                    ) {
                                        //start setting nằm trong upcoming
                                        checkDuplicate = true;
                                    }
                            });
                            if (checkDuplicate == false) {
                                time.push(elementDateSeting);
                            }
                        });
                        if (time.length != 0) {
                            data.push({
                                date: elementDate,
                                time: time
                            });
                        }
                    });
                    break;
                default:
                    break;
            }
        });
        let timeTaken = Date.now() - start;
        console.log('Total time taken : ' + timeTaken + ' milliseconds');
        return ReS(
            res,
            {
                // data:dataAppointmentSetting,
                data,
                arrDayOfWeek,
                mondays,
                tuesdays,
                wednesdays,
                thursday,
                fridays,
                saturdays,
                sundays,
                dataAppointmentUpcoming,
                arrObjectDayOfWeek
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getAllUserAppointmentComplete(req, res, next) {
    try {
        // let dateNow = new Date(Date.now() + 7 * (60 * 60 * 1000));
        // console.log('dateNow===', dateNow);
        let data;
        if (req.user.role_id == RoleConstant.Mentor.id) {
            data = await findAllUserAppointmentCompleteByMentorId(req.user.id);
        } else {
            data = await findAllUserAppointmentCompleteByMenteeId(req.user.id);
        }
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getAllUserAppointmentUpcoming(req, res, next) {
    try {
        // let dateNow = new Date(Date.now() + 7 * (60 * 60 * 1000));
        // console.log('dateNow===', dateNow);
        let data;
        if (req.user.role_id == RoleConstant.Mentor.id) {
            data = await findAllUserAppointmentUpcomingByMentorId(req.user.id);
        } else {
            data = await findAllUserAppointmentUpcomingByMenteeId(req.user.id);
        }
        return ReS(
            res,
            {
                data
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

function getDateByDayOfWeek(date) {
    var d = date || new Date(),
        month = d.getMonth(),
        mondays = [],
        tuesdays = [],
        wednesdays = [],
        thursday = [],
        fridays = [],
        saturdays = [],
        sundays = [];

    d.setDate(1);
    // console.log("monthmonthmonthmonthmonth", month)
    // Get the first Monday in the month
    // while (d.getDay() !== 1) {
    //     d.setDate(d.getDate() + 1);
    // }
    // let timeOneDay = 86400000
    // let timeZone = 7 * (60 * 60 * 1000)
    // let timeDayOne = timeOneDay
    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
        switch (d.getDay()) {
            case 1:
                mondays.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            case 2:
                tuesdays.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            case 3:
                wednesdays.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            case 4:
                thursday.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            case 5:
                fridays.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            case 6:
                saturdays.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            case 0:
                sundays.push(new Date(d.getTime()).toISOString().split('T')[0]);
                break;
            default:
                break;
        }
        d.setDate(d.getDate() + 1);
    }

    return { mondays, tuesdays, wednesdays, thursday, fridays, saturdays, sundays };
}
// arrObjectDayOfWeek.MONDAY.forEach(elementDateSeting => {
//     dataAppointmentUpcoming = dataAppointmentUpcoming.filter( (el) =>{  // remove element in arr
//         return el.date_col_formed != "2022-09-23";
//     });
// });
