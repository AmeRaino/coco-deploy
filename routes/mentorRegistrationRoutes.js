const express = require('express');
const router = express.Router();
const mentorRegistrationController = require('../controllers/mentorRegistrationController');
const authController = require('./../controllers/authController');

router.use(authController.protect);

router.get('/check-mentor-registration-form', mentorRegistrationController.checkMentorRegistrationForm);

router.post('/', mentorRegistrationController.createMentorRegistrationByUser);

module.exports = router;
