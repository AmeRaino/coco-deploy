const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authController = require('./../controllers/authController');

router.get('/', courseController.getAllCourse);

router.get('/:id', courseController.getCourse);

module.exports = router;
