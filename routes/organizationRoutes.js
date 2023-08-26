const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const uploadAvatar = require('../lib/upload');

const authController = require('./../controllers/authController');

router.use(authController.protect);
// router.use(authController.restrictTo('Owner'));
// router.use(authController.restrictToSys({ organizations: "view" }));

router.get('/', authController.restrictToSys({ organizations: 'view' }), organizationController.getAllOrganizations);

router.get('/:id', authController.restrictToSys({ organizations: 'view', my_organization: 'view' }), organizationController.getOrganization);

router.post(
    '/',
    authController.restrictToSys({ organizations: 'new' }),
    uploadAvatar.uploadAvatar.array('avatar', 15),
    organizationController.createOrganization
);

router.delete('/:id', organizationController.deleteOrganization);

router.put(
    '/:id',
    authController.restrictToSys({ organizations: 'edit', my_organization: 'edit' }),
    uploadAvatar.uploadAvatar.array('avatar', 15),
    organizationController.updateOrganization
);

module.exports = router;
