/* jshint indent: 2 */
"use strict";
module.exports = function (sequelize, DataTypes) {
  const EventRecord = sequelize.define('EventRecord', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    merchantId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      field: 'merchant_id'
    },
    subId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
      field: 'sub_id'
    },
    eventName: {
      type: DataTypes.STRING(80),
      allowNull: true,
      field: 'event_name'
    },
    eventCategory: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'event_category'
    },
    sourceUrl: {
      type: DataTypes.STRING(80),
      allowNull: true,
      field: 'source_url'
    },
    sourceParamIn: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'source_param_in'
    },
    resultData: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'result_data'
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1'
    },
    delay: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    grayType: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '0',
      field: 'gray_type'
    },
    created: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    modified: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
      freezeTableName: true,
      timestamps: false,
      tableName: 'event_record'
    });
  return EventRecord;
};
