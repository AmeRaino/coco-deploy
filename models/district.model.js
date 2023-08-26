module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define("District", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    province_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name_vi: DataTypes.STRING,
    name_en: DataTypes.STRING,
  }, {
    tableName: 'district'
  });
  Model.associate = function (models) {
    Model.hasMany(models.Ward, { foreignKey: 'district_id', as: 'ward' })
    Model.belongsTo(models.Province, { foreignKey: 'province_id' , as: 'province'})
  };
  return Model;
};
