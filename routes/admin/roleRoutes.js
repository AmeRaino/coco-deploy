const express = require('express');
const router = express.Router();
const { getAllRoles, getRolePermissions } = require('../../controllers/adminController/roleController');
import { protect } from '../../controllers/adminController/authController';

router.use(protect);

// Get Routes
router.get('/getAllRoles', getAllRoles);
router.get('/getRolePermissions/:role_id', getRolePermissions);

module.exports = router;
