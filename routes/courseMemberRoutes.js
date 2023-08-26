import { Router } from 'express';
const router = Router();
import { createCourseMember } from '../controllers/courseMemberController';

import { protect } from './../controllers/authController';

router.use(protect);
router.post('/create-course-member', createCourseMember);

module.exports = router;
