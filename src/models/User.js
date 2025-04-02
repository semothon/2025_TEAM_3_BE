const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      login_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
      },
      profile_img: {
        type: DataTypes.STRING,
      },
      interest: {
        type: DataTypes.JSON,
      },
      hobby: {
        type: DataTypes.JSON,
      },
      timetable: {
        type: DataTypes.JSON,
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
    tableName: 'users',
    timeStamps: true,
    underscored: true,

});

module.exports = User;
