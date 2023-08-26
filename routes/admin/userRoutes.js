const express = require('express');
import { login, protect } from '../../controllers/adminController/authController';
const router = express.Router();
const {
    searchUsers,
    getAllUsers,
    getUserDetails,
    getUsersByRole,
    lockUser,
    deleteUser,
    getUserByRolePageNumber,
    searchUsersPageNumber,
    getCountAllUserByRole,
    getProvinces,
    getDistricts,
    getWards,
    updateUserInfomations,
    updateUserExperience,
    updateUserEducation,
    updateUserPrize,
    updateUserSkill,
    updateUserCeritificate,
    updateUserExtracurricularActivities,
    deleteUserSubInfomation,
    createUserSubInfomation,
    getUserByRoleForNotification
} = require('../../controllers/adminController/userController');

// Post routes
router.post('/login', login);

router.use(protect);

router.post('/user/:user_id/:subInfo', createUserSubInfomation);

// Get routes
router.get('/searchUsers', searchUsers);
router.get('/searchUsersPageNumber/:limit', searchUsersPageNumber);
router.get('/getAllUsers', getAllUsers);
router.get('/getUserDetails/:user_id', getUserDetails);
router.get('/getUserByRole', getUsersByRole);
router.get('/getUserByRoleForNotification', getUserByRoleForNotification);
router.get('/getUserByRolePageNumber', getUserByRolePageNumber);
router.get('/getCountAllUserByRole/:role_id', getCountAllUserByRole);

router.get('/getProvinces', getProvinces);
router.get('/getDistricts/:province_id', getDistricts);
router.get('/getWards/:district_id', getWards);

// Put routes
router.put('/lockUser', lockUser);

router.put('/updateUserInfomations/:id', updateUserInfomations);
router.put('/updateUserExperience/user/:id/experience/:experience_id', updateUserExperience);
router.put('/updateUserEducation/user/:id/education/:education_id', updateUserEducation);
router.put('/updateUserPrize/user/:id/prize/:prize_id', updateUserPrize);
router.put('/updateUserSkill/user/:id/skill/:skill_id', updateUserSkill);
router.put('/updateUserCertificate/user/:id/certificate/:certificate_id', updateUserCeritificate);
router.put('/updateUserExtracurricularActivities/user/:id/activity/:activities_id', updateUserExtracurricularActivities);

// Delete routes
router.delete('/deleteUser/:user_id', deleteUser);

router.delete('/user/:user_id/:subInfo', deleteUserSubInfomation);

module.exports = router;
