const express = require('express');
const router = express.Router();
const courseReviewSuggestionTagController = require('../controllers/courseReviewSuggestionTagController');

router.get('/', courseReviewSuggestionTagController.getAllCourseReviewSuggestionTag);

module.exports = router;
