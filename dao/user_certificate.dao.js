import { UserCertificate } from '../models';

export const findUserCertificateByID = async (id) => {
    try {
        return UserCertificate.findByPk(id);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserCertificateByID function at user_certificate.dao.js file`);
    }
};

export const createOneUserCertificate = async (data) => {
    try {
        return await UserCertificate.create(data);
    } catch (error) {
        throw new Error(`Error: ${error}, traceback findUserCertificateByID function at user_certificate.dao.js file`);
    }
};

export const updateOneUserCeritificateByID = async (certificate_id, update) => {
    try {
        await UserCertificate.update(update, {
            where: {
                id: certificate_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback updateOneUserCeritificateByID function at user_certificate.dao.js file`);
    }
};

export const deleteOneUserCertificateByID = async (id) => {
    try {
        await UserCertificate.destroy({
            where: {
                id: id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteOneUserCertificateByID function at user_certificate.dao.js file`);
    }
};

export const deleteAllUserCertificateByID = async (user_id) => {
    try {
        await UserCertificate.destroy({
            where: {
                user_id: user_id
            }
        });
    } catch (error) {
        throw new Error(`Error: ${error}, traceback deleteAllUserCertificateByID function at user_certificate.dao.js file`);
    }
};
