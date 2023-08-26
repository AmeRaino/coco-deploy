import { Router } from 'express';
const router = Router();
import { protect, restrictToSys } from '../controllers/authController';
import {
    getAllAppointmentSetting,
    createAppointmentSetting,
    updateAppointmentSetting,
    deleteAppointmentSetting,
    getAllRequestAppointmentNew,
    getAllUserAppointmentComplete,
    refuseRequestAppointment,
    acceptRequestAppointment,
    getAllUserAppointmentUpcoming,
    getAllUserAppointmentReady
} from '../controllers/userAppointmentController';

router.use(protect);

router.get('/setting', getAllAppointmentSetting);

router.post('/setting', createAppointmentSetting);

router.put('/setting/:id', updateAppointmentSetting);

router.delete('/setting/:id', deleteAppointmentSetting);

router.get('/request/new', getAllRequestAppointmentNew);

router.put('/request/accept/:id', acceptRequestAppointment);

router.put('/request/refuse/:id', refuseRequestAppointment);

router.get('/complete', getAllUserAppointmentComplete);

router.get('/upcoming', getAllUserAppointmentUpcoming);

router.get('/ready/by-month/:id', getAllUserAppointmentReady);

export default router;
