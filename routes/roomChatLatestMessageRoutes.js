const express = require('express');
const router = express.Router();
import { getRoomChatLatestMessageController } from '../controllers/roomChatLatestMessageController';

router.post('/get-all-lates-chat', getRoomChatLatestMessageController);

export default router;
