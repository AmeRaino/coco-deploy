import { async } from '@firebase/util';
import { getAllConsultingField, getAllMentor, getAllMentee, getAllCourse } from '../../dao/consulting_field.dao';
import { getTranslate } from '../../utils/translate';
import { ReS } from '../../utils/util.service';

export const getConsultingField = async (req, res, next) => {
    const { language } = req.user;
    try {
        const data = await getAllConsultingField();

        return ReS(res, { consulting_field: data }, 200);
    } catch (error) {
        next(error);
    }
};

export const countMentorMenteeCourse = async (req, res, next) => {
    try {
        const mentor = await getAllMentor();
        const mentee = await getAllMentee();
        const course = await getAllCourse();

        return ReS(res, { data: { mentor, mentee, course } }, 200);
    } catch (error) {
        next(error);
    }
};
