import { to, ReE, ReS, TE } from '../utils/util.service';
import { getTranslate } from '../utils/translate';
import { errorCode, successCode } from '../utils/util.helper';
import { createRequestAppointment, findAllRequestAppointmentByUserId, findAllRequestAppointmentCreatedByMenteeId } from '../dao/user_appointment.dao';
import { sendRequestNotification } from '../lib/firebase_fcm';
const RequestAppointmentConstant = require('../constants/RequestAppointmentConstant');

export async function bookAnAppointment(req, res, next) {
    try {
        var { date, start_time, end_time, connection_method, connection_link, message, with_mentor_id } = req.body;
        if (!date || !start_time || !end_time || !connection_method || !connection_link || !message || !with_mentor_id) {
            return ReE(res, 'Bạn thiếu field', 400, contantStatus.errorCode.DataNull);
        }

        const listAppointment = await findAllRequestAppointmentCreatedByMenteeId(req.user.id);
        // console.log(listAppointment);

        const result = listAppointment.filter((element) => {
            return (element.date === date && element.start_time === start_time);
        });
        // console.log(result);

        if(result.length === 0){
            const data = await createRequestAppointment(req.user.id, req.body, RequestAppointmentConstant.NEW.code);
            if (data) {
                const sendDate = new Date(Date.now() + 7 * (60 * 60 * 1000));
                await sendRequestNotification(with_mentor_id, req.user.id, 'appointment', req.user.language, sendDate);
                return ReS(
                    res,
                    {
                        data,
                        message: getTranslate('Create Data Success', req.user.language)
                    },
                    200
                );
            }
            return ReE(res, getTranslate('Cannot Book Appointment In The Past', req.user.language), 400, errorCode.Exception);
        }
        else return ReE(res, getTranslate('The appointment have existed already!', req.user.language), 400, errorCode.Exception);
    } catch (error) {
        next(error);
    }
}
