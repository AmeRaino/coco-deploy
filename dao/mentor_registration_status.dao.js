import { MentorRegistrationStatus } from "../models";

export const getMentorRegistrationStatusByID = async (id) => {
  try {
    const data = await MentorRegistrationStatus.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return data;
  } catch (error) {
    throw new Error(`${error}, traceback getMentorRegistrationStatus function at mentor_registration_status.dao.js `);
  }
};
