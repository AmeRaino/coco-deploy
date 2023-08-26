const express = require('express');
const router = express.Router();
const securityController = require('../controllers/securityController');
const upload = require('../lib/upload');
const authController = require('./../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictToSys({ stations: 'view' }));
router.route('/get-all-security/:station_id').get(securityController.getAllSecurityByStation);
router.post('/:station_id', authController.restrictToSys({ stations: 'new' }), securityController.createSecurity);
router.delete('/:id', authController.restrictToSys({ stations: 'delete' }), securityController.deleteSecurity);

module.exports = router;
