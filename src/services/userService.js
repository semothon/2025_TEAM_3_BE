// services/userService.js
const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.createUserBasic = async ({ name, email, password, login_id }) => {
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
  });

  return newUser;
};


exports.updateUserExtra = async (userId, { hobby, interest, department, timetable }) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  user.hobby = hobby || user.hobby;
  user.interest = interest || user.interest;
  user.department = department || user.department;
  user.timetable = timetable || user.timetable;

  await user.save();
  return user;
};
