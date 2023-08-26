let cryptoJS = require('crypto-js');
let secretKey = 'coCo2021Crypto';

const encryptKey = (id) => {
    let str = cryptoJS.AES.encrypt(id.toString(), secretKey).toString();
    str = str.replace(/[+]/g, 'xMl3Jk').replace(/[/]/g, 'Por21Ld').replace(/[=]/g, 'Ml32');
    return str;
};

const decryptKey = (cipher) => {
    cipher = cipher
        .replace(/xMl3Jk/g, '+')
        .replace(/Por21Ld/g, '/')
        .replace(/Ml32/g, '=');

    // Decrypt
    return cryptoJS.AES.decrypt(cipher, secretKey).toString(cryptoJS.enc.Utf8);
};

module.exports.encryptKey = encryptKey;
module.exports.decryptKey = decryptKey;
