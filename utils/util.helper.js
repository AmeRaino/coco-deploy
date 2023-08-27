const adminStatus = {
    None: 0,
    Active: 1,
    Inactive: 2,
};
module.exports.adminStatus = adminStatus;

const gender = {
    Female: false,
    Male: true,
};
module.exports.gender = gender;

const errorCode = {
    Unknow: 10000,
    TimeOut: 10001,
    Exception: 10002,
    DataNull: 10003,
    InvalidData: 10004,
    NotFound: 10005,
    Exist: 10006,
    Unconfimred: 10007,
    Incorrect: 10008,
    CanNot: 10009,
    Block: 10010,
    Forbidden: 10011,
    // ConfirmationFailed:10009
};
module.exports.errorCode = errorCode;

const successCode = {
    Confimred: 20001
    // SuccessfulConfirmation:20001
};
module.exports.successCode = successCode;