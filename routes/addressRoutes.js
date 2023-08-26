const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/province/', addressController.getAllProvince);

router.get('/district/by-province/:id', addressController.getAllDistrictByProvinceId);

router.get('/ward/by-district/:id', addressController.getAllWardByDistrictId);

module.exports = router;
