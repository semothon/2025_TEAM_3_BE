const authService = require('../services/authService');

exports.loginUser = async (req, res) => {
  try {
    const { login_id, password } = req.body;
    const { token } = await authService.loginUser(login_id, password);
    res.status(200).json({ token, message: "환영합니다!" });
  } catch (err) {
    console.error(err);
    // 에러 메시지에 따라 401 상태 코드 반환
    if (err.message === "없는 사용자 입니다" || err.message === "잘못된 비밀번호 입니다.") {
      return res.status(401).json({ message: err.message });
    }
    res.status(500).json({ message: "서버 에러" });
  }
};
