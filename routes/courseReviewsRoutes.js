const express = require('express');
const router = express.Router();
const courseReviewsController = require('../controllers/courseReviewsController');
const authController = require('./../controllers/authController');

router.get('/:id', courseReviewsController.getAllCourseReviewByCourse);

router.use(authController.protect);

router.post('/:id', courseReviewsController.createCourseReviews);

module.exports = router;
