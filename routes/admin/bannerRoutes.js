import express from 'express';
const router = express.Router();
import upload from '../../lib/upload';
import {
    orderBanner,
    swapBanner,
    deleteBanner,
    getAllBanners,
    getBannerById,
    uploadBanners,
    updateOneBanner,
    getAllBannersVer2
} from '../../controllers/adminController/bannerController';
import { protect } from '../../controllers/adminController/authController';

router.use(protect);

// Get routes
router.get('/getAllBanners', getAllBanners);

router.get('/getAllBannersVer2', getAllBannersVer2);

router.get('/:id', getBannerById);

// Get routes
router.post('/moveBanner', swapBanner);

// Get routes
router.post('/orderBanner', orderBanner);

// Post routes
router.post('/uploadBanner', upload.uploadBanner.single('banner'), uploadBanners);

// Patch routes
router.post('/updateBanner', upload.uploadBanner.single('banner'), updateOneBanner);

// Delete routes
router.delete('/deleteBanner/:id', deleteBanner);

module.exports = router;
