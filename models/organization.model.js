const Role = require("./role.model");
module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define("Organization", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    nameVi: DataTypes.STRING,
    description: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
      // validate: { isEmail: { msg: "Phone number invalid." } }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
      // validate: {
      //   len: { args: [7, 20], msg: "Phone number invalid, too short." },
      //   isNumeric: { msg: "not a valid phone number." }
      // }
    },
    address: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    url_logo: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
  });
  Model.associate = function (models) {
    // Model.belongsTo(models.Role, { foreignKey: 'id', as: 'role' })
    Model.hasMany(models.User, { foreignKey: 'organization_id', as: 'user' })
  };
  return Model;
};
