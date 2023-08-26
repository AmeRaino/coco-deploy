import { to, ReE, ReS, TE } from '../utils/util.service';
import { User, Role, Organization, UserConnection, UserRequestAppointment, Course, UserAppointment, UserAppointmentSetting } from '../models';
import { errorCode, successCode } from '../utils/util.helper';
import { deleteOne } from './baseController';
import { findAndCountAllUserByRoleAndSearch, getUserDetail as getOneUserDetail, findOneUser } from '../dao/user.dao';
import { getRateUserReview } from '../dao/user_reviews.dao';
import moment from 'moment';
const RoleConstant = require('../constants/RoleConstant');
var Sequelize = require('sequelize');
const { Op, col } = require('sequelize');

export async function getAllUserMentor(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'id', search = '', arrangement = 'ASC', user_consulting_field_id } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        } else if ((order = 'rate')) {
            order = Sequelize.fn('AVG', Sequelize.col('user_reviews.rate'));
        }

        let filterConsultingField = undefined;
        if (user_consulting_field_id != undefined && user_consulting_field_id != '') {
            if (typeof user_consulting_field_id == 'string') {
                user_consulting_field_id = JSON.parse('[' + user_consulting_field_id + ']');
            }
            filterConsultingField = {
                consulting_field_id: {
                    [Op.or]: user_consulting_field_id
                }
            };
        }

        let { count, rows } = await findAndCountAllUserByRoleAndSearch(
            RoleConstant.Mentor.id,
            search,
            amount,
            page,
            order,
            arrangement,
            filterConsultingField
        );
        return ReS(
            res,
            {
                count: count,
                data: rows
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export function convertDayOfWeekToNumber(dayOfWeek) {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const index = days.indexOf(dayOfWeek);
    return index !== -1 ? index : -1;
}

export function convertDayOfWeek(dayNumber) {
    const daysOfWeek = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    if (dayNumber >= 0 && dayNumber <= 6) {
        return daysOfWeek[dayNumber];
    } else {
        return 'Không hợp lệ';
    }
}

export function getLich(arr_calender, arr_calender_Full, dataDate, i) {
    let newArr = [];
    // let dataFunction = [];
    const datenow = new Date();
    newArr = arr_calender.filter((item) => item !== null);
    let recentday = newArr[0] - new Date().getDay();
    let day_min = new Date(moment(datenow.setDate(datenow.getDate() + recentday)).format('YYYY-MM-DD'));
    for (let j of arr_calender_Full) {
        if (j.id === newArr[0]) {
            let day = new Date(day_min).getDay();
            // console.log(convertDayOfWeek(day));
            dataDate.push({ ...i.dataValues, recentday: day_min, start_time: j.gio, day: convertDayOfWeek(day) });
        }
    }
    return dataDate;
}

export function convertTimeToSeconds(timeString) {
    const time = moment(timeString, 'HH:mm');
    const seconds = time.hours() * 3600 + time.minutes() * 60;
    return seconds;
}

export async function getAllUserMentorVer2(req, res, next) {
    try {
        let { page = 0, amount = 10, order = 'id', search = '', arrangement = 'ASC', user_consulting_field_id } = req.query;
        if (!arrangement || (arrangement != 'ASC' && arrangement != 'DESC') || arrangement == '') {
            arrangement = 'ASC';
        }
        if (order == '') {
            order = 'id';
        } else if ((order = 'rate')) {
            order = Sequelize.fn('AVG', Sequelize.col('user_reviews.rate'));
        }

        let filterConsultingField = undefined;
        if (user_consulting_field_id != undefined && user_consulting_field_id != '') {
            if (typeof user_consulting_field_id == 'string') {
                user_consulting_field_id = JSON.parse('[' + user_consulting_field_id + ']');
            }
            filterConsultingField = {
                consulting_field_id: {
                    [Op.or]: user_consulting_field_id
                }
            };
        }

        let { count, rows } = await findAndCountAllUserByRoleAndSearch(
            RoleConstant.Mentor.id,
            search,
            amount,
            page,
            order,
            arrangement,
            filterConsultingField
        );
        const data = rows.map((element) => {
            // Thực hiện xử lý và biến đổi phần tử ở đây
            return element;
        });
        // tạo biến để lấy ra ngày gần nhất
        let dataDate = [];
        // tìm ra ngày lớn nhất trong UserAppointment để xét ra khoảng thời gian
        let booked = await UserAppointment.findAll({
            where: { date: { [Op.gte]: new Date() } }
        });
        let today = new Date();

        // Tính số mili giây của 7 ngày tiếp theo
        let nextWeek = today.getTime() + 24 * 60 * 60 * 1000;

        // Tạo đối tượng Date mới từ số mili giây của 7 ngày tiếp theo
        let dateNextWeek = new Date(nextWeek);

        // console.log(dateNextWeek);
        // sắp xếp để lấy ra ngày
        booked.sort((a, b) => new Date(a.date) - new Date(b.date));
        let daybooked = booked[booked.length - 1];
        let dayPeriod;
        if (daybooked === undefined) {
            dayPeriod = dateNextWeek;
        } else {
            dayPeriod = daybooked.date;
        }
        // console.log(dayPeriod);
        // khai mang cuoi cung in ra
        let dataEnd = [];

        // lặp các phần tử trong rows để tìm ra ngày gần nhất cho các phần tử
        for (let i of data) {
            let userAppoint = [];
            let userAppointSetting = [];

            let calender = await UserAppointmentSetting.findAll({
                where: { user_id: i.id }
            });
            let calender_booked = await UserAppointment.findAll({
                where: { with_mentor_id: i.id, date: { [Op.gte]: new Date() } }
            });

            let calenderNew = [];

            // console.log(calender);
            // console.log(calender_booked);

            for (const i of calender) {
                calenderNew.push({
                    id: i.id,
                    user_id: i.user_id,
                    day_of_week: convertDayOfWeekToNumber(i.day_of_week),
                    start_time: i.start_time,
                    end_time: i.end_time,
                    connection_method: i.connection_method,
                    connection_link: i.connection_link
                });
            }

            // console.log(calenderNew);

            userAppoint = calenderNew;
            userAppointSetting = calender_booked;
            userAppoint.sort((a, b) => a.day_of_week - b.day_of_week);
            userAppointSetting.sort((a, b) => new Date(a.date) - new Date(b.date));

            // console.log(userAppoint);
            // console.log(userAppointSetting);

            const datenow = new Date();
            //
            const datel = new Date(dayPeriod);

            // console.log(datel);

            // tính ra số lần lặp (lặp theo tuần)
            let week = Math.floor(
                (new Date(moment(new Date(datel.getFullYear(), datel.getMonth(), datel.getDate())).format('YYYY-MM-DD')) -
                    new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format('YYYY-MM-DD'))) /
                    (86400000 * 7) +
                    3
            );
            // console.log(week);
            // lam tron xuong nen phai cong them 1 nhung vi chay den < nen phai cong them 2
            let arr_calender_booked = [];
            // tìm ra các ngày đặt chuyển về thứ
            for (let j of userAppointSetting) {
                let ngay =
                    new Date(moment(new Date(j.date)).format('YYYY-MM-DD')) -
                    new Date(moment(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).format('YYYY-MM-DD'));
                arr_calender_booked.push(ngay / 86400000 + datenow.getDay());
            }

            // console.log(arr_calender_booked);

            let arr_calender = [];
            let arr_calender_Full = [];

            // lặp các tuần theo các thứ để tìm ra các ngày gần nhất trong khoảng thời gian các tuần đó
            for (let index = 0; index < week; index++) {
                for (let i of userAppoint) {
                    {
                        let t = Number(i.day_of_week) + Number(index * 7);
                        let hour = datenow.getHours() * 3600 + datenow.getMinutes() * 60;
                        if (t >= new Date().getDay()) {
                            if (t === new Date().getDay() && hour > convertTimeToSeconds(i.start_time)) {
                            } else {
                                arr_calender.push(Number(i.day_of_week) + Number(index * 7));
                                arr_calender_Full.push({ id: Number(i.day_of_week) + Number(index * 7), gio: i.start_time });
                            }
                        }
                    }
                }
            }
            // sắp xếp và loại các ngày đã booked để tìm ra ngày gần nhất
            for (let index = 0; index < arr_calender_booked.length; index++) {
                for (let index = 0; index < arr_calender.length; index++) {
                    if (arr_calender_booked[index] === arr_calender[index]) {
                        delete arr_calender[index];
                    }
                    if (arr_calender[index] <= new Date().getDay()) {
                        delete arr_calender[index];
                    }
                }
            }
            dataEnd = getLich(arr_calender, arr_calender_Full, dataDate, i);
        }

        let arrmentor = [];
        for (const i of data) {
            arrmentor.push({ ...i.dataValues, recentday: null, start_time: null, day: null });
        }

        for (let i = 0; i < dataEnd.length; i++) {
            for (let j = 0; j < arrmentor.length; j++) {
                if (dataEnd[i].id === arrmentor[j].id) {
                    const temp = dataEnd[i];
                    dataEnd[i] = arrmentor[j];
                    arrmentor[j] = temp;
                }
            }
        }

        return ReS(
            res,
            {
                count: count,
                data: arrmentor
            },
            200
        );
    } catch (error) {
        next(error);
    }
}

export async function getUser(req, res, next) {
    try {
        const data = await findOneUser(req.params.id);
        if (!data) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }
        if (data.is_removed == true) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
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

export async function getUserDetail(req, res, next) {
    try {
        const data = await getOneUserDetail(req.params.id);
        if (!data) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }
        if (data.is_removed == true) {
            return ReE(res, 'User not found', 400, errorCode.NotFound);
        }

        const validCourse = data.course.filter((element) => {
            // const courseDate = moment(element.dataValues.end_time).format('DD/MM/YYYY');
            const courseDate = new Date(element.dataValues.end_time);
            // const dateNow = moment(Date.now()).format('DD/MM/YYYY');
            const dateNow = new Date(Date.now());
            // console.log(courseDate >= dateNow);
            return courseDate >= dateNow;
        });

        // console.log(validCourse);

        data.dataValues.course = validCourse;

        const { rate_avg, rows } = await getRateUserReview(req.params.id);
        data.dataValues.user_review = rows;
        data.dataValues.rate_avg = rate_avg;

        const userConnectionCount = await UserConnection.findAll({
            where: {
                [Op.or]: [
                    {
                        connected_user_id: req.params.id
                    },
                    {
                        created_by_user_id: req.params.id
                    }
                ],
                [Op.and]: [
                    {
                        connected: true
                    }
                ]
            }
        });

        let count = userConnectionCount.length;
        data.dataValues.connectionCount = count;

        const userRequestAppointmentCount = await UserRequestAppointment.findAll({
            where: {
                [Op.and]: [
                    {
                        status: 'ACCEPT'
                    },
                    {
                        with_mentor_id: req.params.id
                    }
                ]
            }
        });
        let userRequestAppointmentArr = new Array();
        userRequestAppointmentCount.forEach((ele) => {
            userRequestAppointmentArr.push(ele.dataValues.create_by_mentee_id);
        });
        const uniqueSet = new Set(userRequestAppointmentArr);
        userRequestAppointmentArr = [...uniqueSet];
        data.dataValues.menteeCount = userRequestAppointmentArr.length;

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

export const deleteUser = deleteOne(User);
