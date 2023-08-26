const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authController = require('./../controllers/authController');

// router.use(authController.protect);

router.get('/get_all_blogs', blogController.getAllBlog);

router.get('/get_blog/:blog_id', blogController.getBlog);

router.get('/get_blogs_of_user/:user_id', blogController.getBlogsOfUser);

module.exports = router;