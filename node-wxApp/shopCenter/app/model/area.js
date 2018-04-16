/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Area = sequelize.define('Area', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    pid: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    areaType: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      field: "area_type"
    }
  }, {
      tableName: 'area',
      timestamps: false,
      freezeTableName: true
    });

    Area.AREA_TYPE_PROVINCE = 1;
    Area.AREA_TYPE_CITY = 2;
    Area.AREA_TYPE_COUNTY = 3;

  return Area;
};
