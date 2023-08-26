const express = require('express');
const router = express.Router();
const menteeController = require('../controllers/menteeController');
const authController = require('./../controllers/authController');

// router.get('/', mentorController.getAllUserMentor);
// router.get('/:id', mentorController.getUserDetail);
router.use(authController.protect);

router.post('/appointment/book', menteeController.bookAnAppointment);

module.exports = router;
