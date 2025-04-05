const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ranking = sequelize.define('Ranking', {
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
  category: {
    type: DataTypes.ENUM('study', 'club'),
    allowNull: false,
  },
  record_num: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  tree: {
    type: DataTypes.ENUM('0', '1', '2', '3'),
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
  }
}, {
  tableName: 'ranking',
  timestamps: false, // 직접 created_at, updated_at 사용
});

const Groups = require('./Groups');
Ranking.belongsTo(Groups, {
  foreignKey: 'group_id',
  as: 'Group'
});

module.exports = Ranking;
