const express = require('express');
const router = express.Router();
const upload = require('../lib/upload');
const roomChatAttachmentController = require('../controllers/roomChatAttachmentController');

router.post('/', upload.uploadChatAttachment.array('attachment', 50), roomChatAttachmentController.uploadFileForRoomChatMember);
export default router;
