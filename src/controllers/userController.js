const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const authService = require('../services/authService');
const { sendPasswordResetEmail } = require('../services/emailService');
const Users = require('../models/User');
const { where } = require('sequelize');

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
      message: "회원가입 성공",
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
    const user = await Users.findByPk(userId);
    if(!user){
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  }catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
}

exports.findId = async (req, res) => {
  try{
    const email = req.body.email;
    const user = await Users.findOne({
      where: { email },
      attributes: ['login_id']
    });
    if(!user){
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ login_id: user.login_id });

  }catch (err){
    console.error(err);
    res.status(500).json({ error: "server err"});
  }
}

exports.findPass = async (req, res) => {
  try{
    const { login_id } = req.body;
    const user = await Users.findOne({ where: { login_id }});
    if(!user){
      return res.status(404).json({ message: "해당 아이디의 사용자가 없습니다." });
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "비밀번호 재설정 이메일이 전송되었습니다." });

  }catch(err){
    console.error(err);
    res.status(500).json({ error: "server err"});
  }
}

exports.resetPass = async (req,res) => {
  try {
    const { token, newPassword } = req.body;
    if(!token || !newPassword){
      return res.status(400).json({ message: "토큰과 새 비밀번호가 없습니다" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    }catch (error){
      return res.status(400).json({ message: "유효하지 않거나 만료된 토큰입니다." });
    }

    const user = await Users.findByPk(payload.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "비밀번호가 재설정되었습니다." });
  }catch (err){
    console.error(err);
    res.status(500).json({ error: "server err"});
  }
}