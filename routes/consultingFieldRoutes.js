const express = require('express');
const router = express.Router();
const consultingFieldController = require('../controllers/consultingFieldController');

router.get('/', consultingFieldController.getAllConsultingField);

module.exports = router;
