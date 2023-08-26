const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authController = require('./../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictToSys({ roles: 'view' }));
// router.use(authController.restrictTo('Owner'));

router.get('/permission-type-and-permission-sys/', roleController.getPermissionTypeAndPermissionSys);

router.get('/', roleController.getAllRoles);

router.get('/getrolepermission/:id', roleController.getRoleIncludePermission);

router.route('/:id').get(roleController.getRole);

router.use(authController.restrictToSys({ roles: 'new' }));

router.post('/', roleController.addRole);

router.use(authController.restrictToSys({ roles: 'edit' }));

router.put('/:id', roleController.updateRole);

router.use(authController.restrictToSys({ roles: 'delete' }));

router.delete('/:id', roleController.deleteRole);

module.exports = router;
