const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

router.get('/test', permissionController.createDefaultPermissions);

router.get('/', permissionController.getAllPermissions);

router.route('/:id').get(permissionController.getPermission);

router.post('/', permissionController.createPermission);

router.delete('/:id', permissionController.deletePermission);

router.put('/:id', permissionController.updatePermission);

module.exports = router;
