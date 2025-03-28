const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupMember = sequelize.define('GroupMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    }
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'groups', 
      key: 'id',
    }
  },
  role: {
    type: DataTypes.ENUM('leader', 'member'),
    allowNull: false,
    defaultValue: 'member',
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  },
  joined_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'group_members',
  timestamps: false, // createdAt, updatedAt 자동 관리를 원하지 않는 경우
});

module.exports = GroupMember;
