const express = require('express');
const router = express.Router();
const accountRequestController = require('../controllers/accountRequestController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);
// router.use(authController.restrictTo('Owner'));
router.use(authController.restrictToSys({ account_requests: 'view' }));

router.route('/').get(accountRequestController.getAllAccountRequest);

router.route('/:id').get(accountRequestController.getOne);

router.put('/action-status/:id', authController.restrictToSys({ account_requests: 'edit' }), accountRequestController.actionStatus);

module.exports = router;
