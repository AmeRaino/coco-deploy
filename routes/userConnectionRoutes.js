import { Router } from 'express';
const router = Router();
import { protect, restrictToSys } from '../controllers/authController';
import {
    getUserConnection,
    checkUserConnection,
    acceptConnection,
    refusedConnection,
    connectionRequest,
    removeConnectionRequest,
    getConnectionRequest,
    getAllConnection,
    getUserConnectionVer2,
    checkFullConnection
} from '../controllers/userConnectionController';

router.use(protect);

router.get('/get-user-random', getUserConnection);

router.get('/check-user-connection/:id', checkUserConnection);

router.get('/check-full-connection', checkFullConnection);

router.put('/get-user-random-v2/:max', getUserConnectionVer2);

router.post('/connection-request/:id', connectionRequest);

router.post('/remove-connection-request/:id', removeConnectionRequest);

router.get('/connection-request', getConnectionRequest);

router.post('/refused-connection/:id', refusedConnection);

router.post('/accept-connection/:id', acceptConnection);

router.get('/get-all-connection', getAllConnection);

export default router;
