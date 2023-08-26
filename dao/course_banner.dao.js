import { CourseBanner } from '../models';

export const deleteCourseBannerByCourseId = async (course_id) => {
    try {
        await CourseBanner.destroy({
            where: {
                course_id: course_id
            }
        });
    } catch (error) {
        throw new Error(`${error}, traceback deleteCourseBannerByCourseId function at course_banner.dao.js file`);
    }
};
