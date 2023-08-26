const { Role, Permission } = require("../models");

const getAllRole = async () => {
  try {
    const roles = await Role.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      /* include: [
        {
          model: Permission,
          as: "permission",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          // RolePermissions is ignored, include/exclude will not affect nested tables, use this to disable attributes
          through: { attributes: [] },
        },
      ], */
    });

    return roles;
  } catch (error) {
    throw new Error(`Error: ${error}, traceback getAllRoles function at DAO folder`);
  }
};

const getRolePermissionsByRoleID = async (role_id) => {
  try {
    const rolePermissions = await Role.findByPk(role_id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: Permission,
          as: "permission",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          through: { attributes: [] },
        },
      ],
    });

    return rolePermissions;
  } catch (error) {
    throw new Error(`Error: ${error}, traceback getRolePermissionsByRoleID function at DAO folder`);
  }
};

module.exports = {
  getAllRole,
  getRolePermissionsByRoleID,
};
