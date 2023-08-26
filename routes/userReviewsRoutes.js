const express = require('express');
const router = express.Router();
const userReviewsController = require('../controllers/userReviewsController');
const authController = require('./../controllers/authController');

router.get('/:id', userReviewsController.getAllMentorReview);

router.use(authController.protect);

router.post('/:id', userReviewsController.createMentorReviews);

module.exports = router;
