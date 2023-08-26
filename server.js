import { createDefaultRoles } from './controllers/roleController';
import { createDefaultPermissions } from './controllers/permissionController';
import { createDefaultOrganizations } from './controllers/organizationController';
import { createDefaultUser } from './controllers/userController';
import { createDefaultRoleType } from './controllers/roleTypeController';
import initDataTempController from './controllers/initDataTempController';
import { db_name, host, port as _port } from './config/config';
import { initSocket } from './controllers/socketController';
import firebase from 'firebase-admin';
import serviceAccount from './config/key/serviceAccountKey.json';
import { ReS } from './utils/util.service';
import { getCourse } from './dao/course_member.dao';

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

import { sequelize } from './models';
import { reScheduleJobsAfterRestartServer } from './lib/schedule';
import moment from 'moment';
import { sendNotificationToMentee } from './controllers/courseMemberController';
import { request } from 'http';
import { async } from '@firebase/util';

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
const port = _port;
// app.listen(port, () =>
// {
//     console.log(`Application is running on port ${port}`);
// });

var server = require('http').Server(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});
initSocket(io);

// Initiallize firebase admin
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

server.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});

cron.schedule('00 00 09 * * *', async () => {
    sendNotificationToMentee();
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
