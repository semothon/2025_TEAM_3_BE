const userService = require('../services/userService');
const authService = require('../services/authService');

exports.loginUser = async (req, res) => {
  try{
    const { login_id, password } = req.body;
    const { token } = await authService.loginUser(login_id, password);
    res.status(200).json({ token, message: "login!" });
  }catch (err) {
    console.error(err);
  }
}

exports.registerBasic = async (req, res) => {
  try {
    const { name, email, password, login_id } = req.body;
    const newUser = await userService.createUserBasic({ 
      name, 
      email, 
      password, 
      login_id, 
    });

    console.log(newUser.toJSON());
    res.status(201).json({
      message: "1단계 회원가입 성공",
      user: { 
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      },
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes('이미 사용 중')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "서버 에러" });
  }
};

// 2단계 회원가입 (추가 정보)
exports.registerExtra = async (req, res) => {
  try {
    // 1단계에서 생성된 userId를 클라이언트가 보내준다고 가정
    const { userId } = req.params;
    const { hobby, interest, department, timetable } = req.body;

    const updatedUser = await userService.updateUserExtra(userId, {
      hobby,
      interest,
      department,
      timetable,
    });
    res.status(200).json({
      message: "2단계 정보 업데이트 성공",
      user: {
        id: updatedUser.id,
        hobby: updatedUser.hobby,
        interest: updatedUser.interest,
        department: updatedUser.department,
        timetable: updatedUser.timetable,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.message === '사용자를 찾을 수 없습니다.') {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "서버 에러" });
  }
};
