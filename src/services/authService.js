const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function loginUser(login_id, password) {
  // 사용자 조회
  const user = await User.findOne({ where: { login_id } });
  if (!user) {
    throw new Error("없는 사용자 입니다");
  }
  // 비밀번호 검증
  const passValid = await bcrypt.compare(password, user.password);
  if (!passValid) {
    throw new Error("잘못된 비밀번호 입니다.");
  }
  // JWT 토큰 생성
  const token = jwt.sign(
    { id: user.id, login_id: user.login_id },
    process.env.JWT_SECRET,
    { expiresIn: '5h' }
  );
  return { token, user };
}

module.exports = { loginUser };
