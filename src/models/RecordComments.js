const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const RecordComment = sequelize.define('record_comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'records',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'record_comments',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'record_comments',
  timestamps: false,
});

RecordComment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = RecordComment;
