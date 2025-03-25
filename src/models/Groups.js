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
    schedule: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user', 
        key: 'id',
      }
    },
    thumbnail: {
      type: DataTypes.STRING,
    },
    goal: {
      type: DataTypes.STRING,
    },
    memo: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'groups',
    timestamps: false,
  });

module.exports = Groups;