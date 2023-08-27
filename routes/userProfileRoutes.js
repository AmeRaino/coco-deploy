import { Router } from 'express';
const router = Router();
import { confirmUser, confirmOtpUser } from '../controllers/userController';
import { login, signup, test, protect, restrictToSys } from '../controllers/authController';
import {
    updateMyProfileIntroduce,
    updateMyProfileEducation,
    updateMyProfileExperience,
    updateMyProfileSkill,
    getMyProfileDetail,
    updateMyProfilePrize,
    updateMyProfileExtracurricularActivities,
    updateMyProfileCertificate,
    updatePersonalInformation
} from '../controllers/userProfileController';

const upload = require('../lib/upload');

router.use(protect);

router.get('/get-my-profile', getMyProfileDetail);

router.put('/personal-information', updatePersonalInformation);

router.put('/introduce', updateMyProfileIntroduce);

router.put('/education', updateMyProfileEducation);

router.put('/experience', updateMyProfileExperience);

router.put('/skill', updateMyProfileSkill);

router.put('/prize', updateMyProfilePrize);

router.put('/extracurricular-activities', updateMyProfileExtracurricularActivities);

router.put('/certificate', updateMyProfileCertificate);

router.post('/signup', signup);

router.get('/test', test);

router.get('/confirm/:username/:code', confirmUser); //user mới: link xác nhận active ở gmail - của user tạo free, check acc request

router.post('/confirm-otp-active', confirmOtpUser); //user mới: xác nhận active ở mobile - của user tạo free, check acc request

export default router;
