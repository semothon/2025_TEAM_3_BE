const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupRanking = sequelize.define('group_ranking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  record_num: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tree: {
    type: DataTypes.ENUM('0', '1', '2', '3'),  // Sequelize에서는 ENUM 값을 문자열로 처리합니다.
    allowNull: false,
    defaultValue: '0',
  },
  fruit_num: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'group_ranking',
  timestamps: false,
});

module.exports = GroupRanking;
