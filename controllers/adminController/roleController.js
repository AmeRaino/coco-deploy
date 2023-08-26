import { getAllRole, getRolePermissionsByRoleID } from "../../dao/roles.dao";
import { getTranslate } from "../../utils/translate";
import { errorCode } from "../../utils/util.helper";
import { ReE, ReS } from "../../utils/util.service";

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await getAllRole();

    return ReS(res, { roles: roles }, 200);
  } catch (error) {
    next(error);
  }
};

export const getRolePermissions = async (req, res, next) => {
  const { role_id } = req.params;

  if (!role_id) {
    return ReE(res, getTranslate("Missing Data Field", language), 400, errorCode.DataNull);
  }

  try {
    const rolePermissions = await getRolePermissionsByRoleID(role_id);
    return ReS(res, { rolePermissions: rolePermissions }, 200);
  } catch (error) {
    next(error);
  }
};
