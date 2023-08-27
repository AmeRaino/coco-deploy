import express from 'express';
const router = express.Router();
import upload from '../lib/upload';
import { protect } from '../controllers/authController';
import { uploadFile, uploadFiles, uploadImage, uploadImages } from '../controllers/uploadController';

router.use(protect);

// Post routes
router.post('/file', upload.uploadFile.single('file'), uploadFile);
// router.post('/files', upload.uploadFile.array('files', 10), uploadFiles);
router.post('/image', upload.uploadImage.single('image'), uploadImage);
router.post('/images', upload.uploadImage.array('images', 10), uploadImages);

module.exports = router;
