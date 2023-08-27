import { Router } from "express";
const router = Router();
import { createFcmToken, deleteFcmTokenById, unactivateFcmToken, updateFcmToken, deleteFcmTokenByToken } from "../controllers/deviceTokenController";
import { protect } from './../controllers/authController'

router.use(protect);
router.post('/create-fcm-token/', createFcmToken);

router.put('/update-fcm-token/:token_id', updateFcmToken);

router.put('/unactivate-fcm-token/:token_id', unactivateFcmToken);

router.delete('/delete-fcm-token-by-id/:token_id', deleteFcmTokenById);

router.delete('/delete-fcm-token-by-token', deleteFcmTokenByToken);

// router.put('/update-fcm-token-with-tokenID/:id', updateFcmTokenWithTokenID);

export default router;