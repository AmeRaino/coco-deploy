import { Router } from 'express';
const router = Router();
import {
    confirmUser,
    forgotPasswordUser,
    confirmForgotPassword,
    changeForgotPassword,
    getUserCompleteAccount,
    completeYourAccount,
    getAllUserWithFullname,
    changeLanguageUser,
    getMyProfile,
    updateMyProfile,
    changePassword,
    getAllUsers,
    getUser,
    createUser,
    approveUser,
    changeStatusUser,
    updateUser,
    getAllUserWithInfoAndRole,
    verifyTokenUser,
    uploadAvatar,
    confirmOtpUser,
    confirmOtpForgotPassword,
    changeNotificationUser,
    removeAccount,
    getConnectionCount
} from '../controllers/userController';
import { login, signup, test, protect, restrictToSys, sendBackOtpSignup, loginFacebook, loginGoogle } from './../controllers/authController';
const upload = require('../lib/upload');

router.post('/login', login);

router.post('/login-facebook', loginFacebook);
router.post('/login/google', loginGoogle);

router.post('/signup', signup);

router.post('/send-back-otp-signup', sendBackOtpSignup);

router.get('/test', test);

router.get('/confirm/:username/:code', confirmUser); //user mới: link xác nhận active ở gmail - của user tạo free, check acc request

router.post('/confirm-otp-active', confirmOtpUser); //user mới: xác nhận active ở mobile - của user tạo free, check acc request

router.get('/forgot-password', forgotPasswordUser); // gửi mail link xác nhận và mã code

router.post('/confirm-otp-forgot-password', confirmOtpForgotPassword); //link khi bấm quên mk sẽ gửi otp để user confirm trên mobile. //trả về mã code mới để sử dụng put change-forgot-pass

router.get('/confirm-forgot-password/:username/:code', confirmForgotPassword); //link khi bấm quên mk sẽ gửi link này để user confirm. //trả về mã code mới để sử dụng put change-forgot-pass

router.put('/change-forgot-password/', changeForgotPassword); // đổi mật khẩu quên pass. gửi đổi mật khẩu gồm mật khẩu kèm mã code confirm

router.route('/get-use-complete-account').get(getUserCompleteAccount);

router.put('/complete-your-account', completeYourAccount);

// Protect all routes after this middleware
router.use(protect);

router.post('/verify-token', verifyTokenUser);

router.get('/get-all-user-with-fullname', getAllUserWithFullname);

router.get('/all-user-and-owner-with-info-role', getAllUserWithInfoAndRole);

router.put('/change-language', changeLanguageUser);

router.put('/change-notification', changeNotificationUser);

router.get(
    '/get-my-profile',
    // restrictToSys({ my_profile: "view" }),
    getMyProfile
);

router.put('/update-my-profile', restrictToSys({ my_profile: 'edit' }), updateMyProfile);

router.put(
    '/change-my-password/',
    // restrictToSys({ change_password: "edit" }),
    changePassword
); // đổi mật khẩu có pass cũ YÊU CẦU ĐĂNG NHẬP.

router.put(
    '/upload-avatar',
    upload.uploadAvatar.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'connection_image', maxCount: 1 }
    ]),
    uploadAvatar
);

router.put('/remove-account', removeAccount);

router.get('/get-connection-count', getConnectionCount);

//ADMIN
router.use(restrictToSys({ account: 'view' }));

router.get('/', getAllUsers);

router.get('/:id', getUser);

router.post('/', restrictToSys({ account: 'new' }), createUser);
// router.use(authController.restrictTo('Owner'));

//Tạo 1 link để owner approve/reject(update status) account request
// nếu reject thì đổi status rồi next
//neewu approve phải gửi đủ thông tin của user + id organization + role

router.post('/approve', approveUser);

// Only admin have permission to access for the below APIs
// router.use(authController.restrictTo('admin'));
router.use(restrictToSys({ account: 'edit' }));

router.put('/change-status/:id', changeStatusUser);

router.put('/:id', updateUser);

// router.delete('/:id',userController.deleteUser);

export default router;
