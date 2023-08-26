import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import { init, configure } from 'i18n';
const i18n = require('i18n');

import routes from './routes/indexRoutes';

import globalErrHandler from './controllers/errorController';
import AppError from './utils/appError';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
const swaggerFile = require('./swagger_output.json');

import { User, Config, ConversationMessage } from './models';
import CONFIG from './config/config';
import moment from 'moment';

const cron = require('node-cron');
const app = express();

app.use(init);
configure({
    locales: ['en', 'vi'],
    directory: __dirname + '/locales',
    // cookie: 'lang',
    defaultLocale: 'en',
    queryParameter: 'language'
    // register: global
});

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour'
});
app.use('/api', limiter);
app.use('/public', express.static('public'));

// Body parser, reading data from body into req.body
app.use(
    express.json({
        limit: '6mb'
    })
);

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

routes(app);

app.use('/test', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        msg: 'HELLO'
    });
});

//Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'CoCo API',
            version: 'v1'
        }
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// cron.schedule('* * * * * *', async () => {
cron.schedule('0 0 * * *', async () => {
    const config = await Config.findOne({
        where: {
            title: 'CONNECTION_COUNT'
        }
    });

    const user = await User.findAll();

    if (!config) {
        user.forEach((element) => {
            element.connection_count = CONFIG.swipe_number;
            element.connection_count_default = CONFIG.swipe_number;
            element.save();
            // console.log(element.connection_count, element.connection_count_default);
        });
    } else {
        user.forEach((element) => {
            element.connection_count = config.value;
            element.connection_count_default = config.value;
            element.save();
            // console.log(element.connection_count, element.connection_count_default);
        });
    }

    const timeNow = moment(Date.now()).subtract(30, 'days');
    // console.log(timeNow);
    const img = await ConversationMessage.findAll({
        where: {
            isDeleted: false,
            contentType: 'image',
            // createdAt: {
            //     [Op.lte]: moment(Date.now()).subtract(30, 'days')
            // }
        }
    });
    // console.log(img);
    img.forEach((element) => {
        // console.log(moment(element.dataValues.createdAt));
        if(moment(element.dataValues.createdAt) < timeNow){
            ConversationMessage.destroy({
                where: {
                    id: element.dataValues.id
                }
            })
        }
    });
    
});

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});

app.use(globalErrHandler);

export default app;
