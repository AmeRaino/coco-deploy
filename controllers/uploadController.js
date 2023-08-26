import { getTranslate } from '../utils/translate';
import { errorCode } from '../utils/util.helper';
import { ReS, ReE } from '../utils/util.service';
import { deleteFile, deleteFiles } from '../lib/deletefile';

export const uploadFile = async (req, res, next) => {
    const file = req.file;
    const language = req.user;
    if(!file) return ReE(res, getTranslate('Missing Data Field', language), 400);
    try {
        return ReS(
            res,
            {
                message: getTranslate('Upload File Successfully', language),
                url: `public/file-upload/${file.filename}`
            },
            200
        );
    } catch (error) {
        if (file) {
            let urlFile = 'public/file-upload/' + file.filename;
            deleteFile(urlFile);
        }
        next(error);
    }
};

export const uploadFiles = async (req, res, next) => {
    const files = req.files;
    const language = req.user;
    if(!files) return ReE(res, getTranslate('Missing Data Field', language), 404, errorCode.InvalidData);
    try {
        return ReS(
            res,
            {
                message: getTranslate('Upload Files Successfully', language),
                // url: `public/file-upload/${files.filename}`
            },
            200
        );
    } catch (error) {
        if (files) {
            // let urlFile = 'public/file-upload/' + files.filename;
            deleteFiles(files);
        }
        next(error);
    }
};

export const uploadImage = async (req, res, next) => {
    const file = req.file;
    const language = req.user;
    console.log(file);
    if(!file) return ReE(res, getTranslate('Missing Data Field', language), 400);
    try {
        return ReS(
            res,
            {
                message: getTranslate('Upload Image Successfully', language),
                url: `public/image-upload/${file.filename}`
            },
            200
        );
    } catch (error) {
        if (file) {
            let urlFile = 'public/image-upload/' + file.filename;
            deleteFile(urlFile);
        }
        next(error);
    }
};

export const uploadImages = async (req, res, next) => {
    const files = req.files;
    const language = req.user;
    if(!files) return ReE(res, getTranslate('Missing Data Field', language), 404, errorCode.InvalidData);
    try {
        return ReS(
            res,
            {
                message: getTranslate('Upload Images Successfully', language),
                // url: `public/image-upload/${files.filename}`
            },
            200
        );
    } catch (error) {
        if (files) {
            // let urlFile = 'public/image-upload/' + files.filename;
            deleteFiles(files);
        }
        next(error);
    }
};