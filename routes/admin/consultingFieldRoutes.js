const express = require('express');
const router = express.Router();

import { protect } from '../../controllers/adminController/authController';
import { getConsultingField, countMentorMenteeCourse } from '../../controllers/adminController/consultingFieldController';

router.get('/getall', countMentorMenteeCourse);

router.use(protect);

router.get('/getConsultingFields', getConsultingField);

module.exports = router;
