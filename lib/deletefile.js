const util = require('util');
const fs = require('fs');

const deleteFiles = (files) => {
    files.forEach((element) => {
        deleteFile(element.path);
    });
};

const deleteFile = (files) => {
    const unlink = util.promisify(fs.unlink);
    if (fs.existsSync(files)) {
        return unlink(files);
    }
    return true;
};

module.exports.deleteFile = deleteFile;
module.exports.deleteFiles = deleteFiles;
