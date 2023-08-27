import firebase from 'firebase-admin';
import * as http from 'http';
import { port as _port, db_name, host } from './config/config';
import serviceAccount from './config/key/serviceAccountKey.json';
import initDataTempController from './controllers/initDataTempController';
import { createDefaultOrganizations } from './controllers/organizationController';
import { createDefaultPermissions } from './controllers/permissionController';
import { createDefaultRoles } from './controllers/roleController';
import { createDefaultRoleType } from './controllers/roleTypeController';
import { initSocket } from './controllers/socketController';
import { createDefaultUser } from './controllers/userController';

const cron = require('node-cron');

import { config } from 'dotenv';
config({
    path: './.env'
});

process.env.TZ = 'Asia/Jakarta';
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

import app from './app';

import { sendNotificationToMentee } from './controllers/courseMemberController';
import { reScheduleJobsAfterRestartServer } from './lib/schedule';
import { sequelize } from './models';

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to SQL database:', db_name);
    })
    .catch((err) => {
        console.error('Unable to connect to SQL database:', db_name);
    });

// if (CONFIG.app === 'dev') {
(async () => {
    await sequelize.sync();
    console.log('----server start', new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    await createDefaultPermissions();
    await createDefaultRoleType();
    await createDefaultRoles();
    await createDefaultOrganizations();
    await createDefaultUser();
    await initDataTempController.createDefaultCourse();
    await reScheduleJobsAfterRestartServer();
    console.log('----server process');
    console.log('----server ready', host + ':' + _port);
})();

// models.sequelize.sync();
// models.sequelize.sync({ force: true });
// }

// Start the server
const port = 5000;
// app.listen(port, () =>
// {
//     console.log(`Application is running on port ${port}`);
// });

const httpServer = http.createServer(app);
var io = require('socket.io')(httpServer, {
    cors: {
        origin: '*'
    }
});
initSocket(io);

// Initiallize firebase admin
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

httpServer.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

cron.schedule('00 00 09 * * *', async () => {
    sendNotificationToMentee();
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    httpServer.close(() => {
        process.exit(1);
    });
});
