const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.ENUM('study', 'club'),
    allowNull: false,
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  max_members: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  num_members: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  field: {
    type: DataTypes.STRING,
  },
  attendance: {
    type: DataTypes.ENUM('every', 'free', 'TBD'),
    defaultValue: 'TBD',
  },
  meet: {
    type: DataTypes.ENUM('online', 'offline', 'both'),
    defaultValue: 'both',
  },
  mood: {
    type: DataTypes.ENUM('friend', 'focus', 'nofriend', 'free'),
    defaultValue: 'free',
  },
  approve: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  leader_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    },
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  goal: {
    type: DataTypes.STRING,
  },
  memo: {
    type: DataTypes.TEXT,
  },
  major: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'groups',
  timestamps: false,
});

module.exports = Group;
