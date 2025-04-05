const userService = require('../services/userService');
const authService = require('../services/authService');
const Users = require('../models/User');
const User = require('../models/User');

exports.loginUser = async (req, res) => {
  try{
    const { login_id, password } = req.body;
    const { token } = await authService.loginUser(login_id, password);
    res.status(200).json({ token, message: "login!" });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "아이디/비밀번호를 다시 확인해주세요" });
  }
}

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      login_id,
      hobby,
      interest,
      department,
      timetable 
    } = req.body;
    const newUser = await userService.createUserBasic({ 
      name, 
      email, 
      password, 
      login_id, 
      hobby,
      interest,
      department,
      timetable
    });

    console.log(newUser.toJSON());
    res.status(201).json({
      message: "1단계 회원가입 성공",
      user: { 
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        hobby: newUser.hobby,
        interest: newUser.interest,
        department: newUser.department,
        timetable: newUser.timetable,
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

exports.deleteAccount = async (req,res) => {
  try{
    const userId = req.user.id;
    const user = Users.findByPk(userId);
    if(!user){
      await user.destroy();
    }
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
}