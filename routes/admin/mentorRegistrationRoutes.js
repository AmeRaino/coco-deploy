const express = require('express');
const router = express.Router();
const {
    updateMentorRegistration,
    getMentorRegistrationsByPage,
    getAllNewMentorRegistrationPageNumber,
    getCountAllNewMentorRegistrations
} = require('../../controllers/adminController/mentorRegistrationController');
import { protect } from '../../controllers/adminController/authController';

router.use(protect);
// Get routes
router.get('/getMentorRegistationsByPage', getMentorRegistrationsByPage);

// Put routes
router.put('/updateMentorRegistration', updateMentorRegistration);

module.exports = router;
