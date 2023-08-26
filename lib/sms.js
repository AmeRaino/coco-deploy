// let { hostname, grant_type, client_id, client_secret, scope, session_id, access_token } = require('../config/sms');
let { hostname, grant_type, client_id, client_secret, scope, session_id, brand_name, access_token } = require('../config/sms');
var Buffer = require('buffer/').Buffer;
const http = require('http');
var request = require('request');

module.exports.getTokenSMS = () => {
    return new Promise((resolve, reject) => {
        if (!session_id) {
            return reject(new Error('invalid get token session_id'));
        }
        // let postData = JSON.stringify({
        // 	grant_type,
        // 	client_id,
        // 	client_secret,
        // 	scope,
        // 	session_id,
        // });
        var options = {
            uri: hostname + '/oauth2/token',
            method: 'POST',
            json: {
                grant_type,
                client_id,
                client_secret,
                scope,
                session_id
            }
        };
        request(options, function (error, response, body) {
            if (!error) {
                console.log('data sms------------------', body);
                // console.log("response------------------", response)
                return resolve(body);
            }
            if (error) {
                return reject(new Error('error get token'));
            }
        });
    });
};

// module.exports.sendSMS = ({access_token, brand_name, phone, message }) => {
module.exports.sendSMS = ({ access_token, phone, message }) => {
    return new Promise((resolve, reject) => {
        if (!access_token) {
            return reject(new Error('invalid sms access_token'));
        }
        // if (!brand_name) { return reject(new Error('invalid sms brand_name')); }
        if (!phone) {
            return reject(new Error('invalid sms phone'));
        }
        if (!message) {
            return reject(new Error('invalid sms message'));
        }
        var options = {
            uri: hostname + '/api/push-brandname-otp',
            method: 'POST',
            json: {
                access_token: access_token,
                session_id: session_id,
                BrandName: brand_name,
                Phone: phone,
                Message: Buffer.from(message).toString('base64')
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log('body sms----------', body);
                return resolve(body);
            } else if (!error) {
                console.log('body sms er----------', body);
                return resolve(body);
            }
            if (error) {
                return reject(new Error('error sendSMS'));
            }
        });
    });
};
