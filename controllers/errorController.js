// Express automatically knows that this entire function is an error handling middleware by specifying 4 parameters
const contantStatus = require('../utils/util.helper');
import { getTranslate } from '../utils/translate';

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    console.log('errrrrr--------', err);
    if (err == 'Error: Images Only!') {
        return res.status(400).json({
            success: false,
            error: err,
            code: contantStatus.errorCode.InvalidData
        });
    } else if (err.code == 'LIMIT_FILE_SIZE' || err.code == 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            error: err,
            code: contantStatus.errorCode.InvalidData
        });
    } else if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(403).json({
            success: false,
            error: getTranslate('Data Exists', req.user.language), 
            code: contantStatus.errorCode.InvalidData,
        });
    } 
    res.status(err.statusCode).json({
        success: false,
        // error: err,
        error: err.message,
        // message: err.message,
        stack: err.stack,
        code: contantStatus.errorCode.Exception
    });
};
