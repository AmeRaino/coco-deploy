import { ConsultingField, User, Course } from '../models';

export const getAllConsultingField = async () => {
    try {
        return await ConsultingField.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback getAllConsultingField function in consulting_field.dao.js at DAO folder`);
    }
};

export const getAllMentor = async () => {
    try {
        const { count, row } = await User.findAndCountAll({
            where: { role_id: 4 },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        return count;
    } catch (error) {
        throw new Error(`${error}, traceback getAllMentor function in consulting_field.dao.js at DAO folder`);
    }
};

export const getAllMentee = async () => {
    try {
        const { count, row } = await User.findAndCountAll({
            where: { role_id: 5 },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        return count;
    } catch (error) {
        throw new Error(`${error}, traceback getAllMentor function in consulting_field.dao.js at DAO folder`);
    }
};

export const getAllCourse = async () => {
    try {
        const { count, row } = await Course.findAndCountAll({});
        return count;
    } catch (error) {
        throw new Error(`${error}, traceback getAllMentor function in consulting_field.dao.js at DAO folder`);
    }
};
