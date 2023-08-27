const express = require('express');
const router = express.Router();
const {
    getCoursesByPage,
    getCourseDetails,
    updateCourse,
    createCourse,
    deleteCourseByID,
    uploadCourseBanners,
    getCoursePageNumberByLimit,
    getCountAllCourse,
    deleteCourseBanner
} = require('../../controllers/adminController/courseController');
import { protect } from '../../controllers/adminController/authController';
import upload from '../../lib/upload';

router.use(protect);

// Post routes
router.post('/createCourse', createCourse);
router.post('/uploadCourseBanner', upload.uploadCourseBanner.single('course_banner'), uploadCourseBanners);

// Get routes
router.get('/getCoursesByPage', getCoursesByPage);
router.get('/getCourseDetails/:id', getCourseDetails);
router.get('/getCoursePageNumberByLimit/:limit', getCoursePageNumberByLimit);
router.get('/getCountAllCourses', getCountAllCourse);

// Put routes
router.put('/updateCourse/:id', updateCourse);

// Delete routes
router.delete('/deleteCourse/:id', deleteCourseByID);
router.delete('/deleteCourseBanner', deleteCourseBanner);

module.exports = router;
