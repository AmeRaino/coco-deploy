const express = require('express');
const router = express.Router();
const userReviewSuggestionTagController = require('../controllers/userReviewSuggestionTagController');

router.get('/', userReviewSuggestionTagController.getAllUserReviewSuggestionTag);

module.exports = router;
