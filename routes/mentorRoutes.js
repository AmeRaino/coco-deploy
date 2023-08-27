const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const authController = require('./../controllers/authController');

router.get('/', mentorController.getAllUserMentor);

router.get('/ver2/', mentorController.getAllUserMentorVer2);

router.get('/:id', mentorController.getUserDetail);

module.exports = router;
