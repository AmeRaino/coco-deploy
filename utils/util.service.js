const { to } = require('await-to-js');
const pe = require('parse-error');
//dùng await to, promise
module.exports.to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if (err) return [pe(err)];

    return [null, res];
};
//khi trả về Error Web Response
module.exports.ReE = function (res, err, statusCode = 200, code = 0) {
    // Error Web Response
    console.error(err);
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
        console.error(err);
    }

    if (typeof code !== 'undefined') res.statusCode = statusCode;

    return res.json({ success: false, error: err, code: code });
};
//trả về Success Web Response
module.exports.ReS = function (res, data, statuscode = 200) {
    // Success Web Response
    let send_data = { success: true };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data); //merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = statuscode;

    return res.json(send_data);
};
//trả trực tiếp về lỗi
module.exports.TE = function (err_message, log) {
    // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
    }
    throw new Error(err_message);
};
