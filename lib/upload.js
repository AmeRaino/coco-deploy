const multer = require('multer');
// const fs = require('fs')
// var limits = { fileSize: 1024 * 1024 * 1024 }
// var upload = multer({ limits: limits })
var path = require('path');
let limits = {
    fields: 10,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    fileSize: 15000000 // 150 KB for a 1080x1080 JPG 90
};

let limitKeyFile = {
    fields: 20,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    fileSize: 15000000 // 150 KB for a 1080x1080 JPG 90
};

let limitDataFile = {
    fields: 50,
    fieldNameSize: 100, // TODO: Check if this size is enough
    fieldSize: 20000000, //TODO: Check if this size is enough
    fileSize: 15000000000 // 150 KB for a 1080x1080 JPG 90
};

let bannerLimits = {
    fields: 10,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    fileSize: 2097152
};

let fileUploadLimits = {
    fields: 10,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    fileSize: 26214400
};

let imageUploadLimits = {
    fields: 10,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 20000, //TODO: Check if this size is enough
    fileSize: 8388608
};

const storageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/avatars');
    },
    filename: (req, file, cb) => {
        console.log('file------', file);
        console.log('file------', file.mimetype);
        var filetypes = /jpeg|jpg|png|tiff|tif/;
        var mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, `${Date.now() + path.extname(file.originalname)}`);
        } else {
            cb('Error: Images Only!');
        }
    }
});

const storageKeyFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/key-file');
    },
    filename: (req, file, cb) => {
        // console.log("file------", file)
        // console.log("file------", file.mimetype)
        // var filetypes = /csv|txt|xml/;
        // var mimetype = filetypes.test(file.mimetype);
        // if (mimetype) {
        return cb(null, `${Date.now() + path.extname(file.originalname)}`);
        // } else {
        //     cb('Error: Key File Only!');
        // }
    }
});

const storagePointMarker = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('destination---file------------', file);

        cb(null, 'public/point-marker');
    },
    filename: (req, file, cb) => {
        // console.log("reqqqqqqqqq",req)
        console.log('filename----file------------', file);
        return cb(null, `${Date.now() + path.extname(file.originalname)}`);
    }
});

const storageChatAttachment = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/chat-attachment');
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now() + file.originalname}`);
    }
});

const storageStationDataFiles = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/station-data-files');
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now() + file.originalname}`);
    }
});

const storageBanners = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('destination---file-------------', file);
        cb(null, 'public/banner');
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now() + file.originalname}`);
    }
});

const storageCourseBanners = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('destination---file-------------', file);
        cb(null, 'public/course_banner');
    },
    filename: (req, file, cb) => {
        return cb(null, `${Date.now() + file.originalname}`);
    }
});

const bannerFilter = (req, file, cb) => {
    const filetypes = /jpg|png|jpeg|tif|heic/;
    const checkType = filetypes.test(file.mimetype);

    if (!file.mimetype.startsWith('image')) cb('Error: Images Only!', false);

    if (!checkType) cb('Error: Image Types Must Be JPG | PNG | JPEG | TIF | HEIC');

    cb(null, true);
};
const storageFileUpload = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/file-upload');
    },
    filename: (req, file, cb) => {
        console.log('file------', file);
        console.log('file------', file.mimetype);
        return cb(null, `${Date.now() + path.extname(file.originalname)}`);
    }
});

const storageImageUpload = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('destination---file-------------', file);
        cb(null, 'public/image-upload');
    },
    filename: (req, file, cb) => {
        console.log('file------', file);
        console.log('file------', file.mimetype);
        var filetypes = /jpeg|jpg|png|heic|gif/;
        var mimetype = filetypes.test(file.mimetype);
        console.log('file------', filetypes);
        console.log('file------', mimetype);
        if (mimetype) {
            return cb(null, `${Date.now() + path.extname(file.originalname)}`);
        } else {
            cb('Error: Images Only!');
        }
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('Error: Images Only!', false);
    }
};
const keyFileFilter = (req, file, cb) => {
    cb(null, true);
};

const fileUploadFilter = (req, file, cb) => {
    cb(null, true);
};

const chatAttachmentFilter = (req, file, cb) => {
    cb(null, true);
};

const stationDataFileFilter = (req, file, cb) => {
    var filetypes = /xlsx|xls|xlsm|xlsb|csv/;
    var mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Excel or Csv only!');
    }
};

const uploadAvatar = multer({ storage: storageAvatar, limits, fileFilter: bannerFilter });
const uploadKeyFile = multer({ storage: storageKeyFile, limitKeyFile, fileFilter: keyFileFilter });

const uploadPointMarker = multer({
    storage: storagePointMarker,
    limits,
    fileFilter: function (_req, file, cb) {
        checkFileType(file, cb);
    }
});
const uploadChatAttachment = multer({ storage: storageChatAttachment, limits, fileFilter: chatAttachmentFilter });
const uploadStationDataFiles = multer({
    storage: storageStationDataFiles,
    limits,
    fileFilter: function (_req, file, cb) {
        stationDataFileFilter(_req, file, cb);
    }
});
const uploadBanner = multer({ storage: storageBanners, bannerLimits, fileFilter: bannerFilter });
const uploadCourseBanner = multer({ storage: storageCourseBanners, limits, fileFilter: bannerFilter });

const uploadFile = multer({ storage: storageFileUpload, fileUploadLimits, fileFilter: fileUploadFilter });
const uploadImage = multer({ storage: storageImageUpload, imageUploadLimits, fileFilter: imageFilter });

function checkFileType(file, cb) {
    // Allowed ext
    var filetypes = /jpeg|jpg|png|tiff|tif/;
    // Check ext
    // var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    var mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const storageDataFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/data-sharing-request');
    },
    filename: (req, file, cb) => {
        // var filetypes = /jpeg|jpg|png|tiff|tif/;
        // var mimetype = filetypes.test(file.mimetype);
        // if (mimetype) {
        // return cb(null, `${Date.now() + path.extname(file.originalname)}`)
        const date = new Date();
        // return cb(null, `${file.originalname.split('.').slice(0, -1).join('.') + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear() + '-' + date.getTime() + path.extname(file.originalname)}`)
        return cb(
            null,
            `${
                'Data-File' +
                req.body.user_id +
                '-' +
                req.body.data_sharing_request_id +
                '-' +
                (date.getMonth() + 1) +
                date.getDate() +
                date.getFullYear() +
                '-' +
                date.getTime() +
                '-' +
                Math.floor(Math.random() * 10000) +
                path.extname(file.originalname)
            }`
        );
        // } else {
        //     cb('Error: Images Only!');
        // }
    }
});
function checkDataFile(file, cb) {
    // Allowed ext
    // var filetypes = /jpeg|jpg|png|tiff|tif/;
    // Check ext
    // var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    // var mimetype = filetypes.test(file.mimetype);

    // if (mimetype) {
    return cb(null, true);
    // } else {
    //     cb('Error: Images Only!');
    // }
}
const uploadDataFile = multer({
    storage: storageDataFile,
    limitDataFile,
    fileFilter: function (_req, file, cb) {
        checkDataFile(file, cb);
    }
});

const storageDashboard = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/dashboard');
    },
    filename: (req, file, cb) => {
        // var filetypes = /jpeg|jpg|png|tiff|tif/;
        // var mimetype = filetypes.test(file.mimetype);
        // if (mimetype) {
        // return cb(null, `${Date.now() + path.extname(file.originalname)}`)
        return cb(null, `${Date.now() + path.extname(file.originalname)}`);
        // } else {
        //     cb('Error: Images Only!');
        // }
    }
});
function checkDashboard(file, cb) {
    // Allowed ext
    // var filetypes = /jpeg|jpg|png|tiff|tif/;
    // Check ext
    // var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    // var mimetype = filetypes.test(file.mimetype);

    // if (mimetype) {
    return cb(null, true);
    // } else {
    //     cb('Error: Images Only!');
    // }
}
const uploadDashboard = multer({
    storage: storageDashboard,
    limitKeyFile,
    fileFilter: function (_req, file, cb) {
        checkDashboard(file, cb);
    }
});

const storageComment = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/comment');
    },
    filename: (req, file, cb) => {
        // var filetypes = /jpeg|jpg|png|tiff|tif/;
        // var mimetype = filetypes.test(file.mimetype);
        // if (mimetype) {
        // return cb(null, `${Date.now() + path.extname(file.originalname)}`)
        return cb(null, `${Date.now() + path.extname(file.originalname)}`);
        // } else {
        //     cb('Error: Images Only!');
        // }
    }
});
function checkComment(file, cb) {
    return cb(null, true);
}
const uploadComment = multer({
    storage: storageComment,
    limitKeyFile,
    fileFilter: function (_req, file, cb) {
        checkComment(file, cb);
    }
});

module.exports.uploadBanner = uploadBanner;
module.exports.uploadCourseBanner = uploadCourseBanner;
module.exports.uploadKeyFile = uploadKeyFile;
module.exports.uploadAvatar = uploadAvatar;
module.exports.uploadPointMarker = uploadPointMarker;
module.exports.uploadDataFile = uploadDataFile;
module.exports.uploadDashboard = uploadDashboard;
module.exports.uploadComment = uploadComment;
module.exports.uploadChatAttachment = uploadChatAttachment;
module.exports.uploadStationDataFiles = uploadStationDataFiles;
module.exports.uploadFile = uploadFile;
module.exports.uploadImage = uploadImage;
