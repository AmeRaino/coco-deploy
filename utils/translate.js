const i18n = require("i18n");

//dùng await to, promise
module.exports.getTranslate = function (phrase, language = "en") {
    return i18n.__({ phrase: phrase, locale: language });
};