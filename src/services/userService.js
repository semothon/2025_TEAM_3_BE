// services/userService.js
const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.createUserBasic = async ({ name, email, password, login_id,hobby,
  interest,
  department,
  timetable }) => {
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new Error('이미 사용 중인 이메일입니다.');
  }
  const existingLoginId = await User.findOne({ where: { login_id } });
  if (existingLoginId) {
    throw new Error('이미 사용 중인 아이디입니다.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    login_id,
    hobby,
    interest,
    department,
    timetable
  });

  return newUser;
};


