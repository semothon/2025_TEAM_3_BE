const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.loginUser = async (req, res) =>{
    try{
        const { login_id, password } = req.body;
        const user = await User.findOne({where: {login_id}});
        if(!user){
            return res.status(401).json({message: "없는 사용자 입니다"});
        }

        const passValid = await bycrypt.compare(password, user.password);
        if(!passValid){
            return res.status(401).json({message: "잘못된 비밀번호 입니다."});
        }

        const token = jwt.sign(
            {id: user.id, login_id: user.login_id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({token, message: "환영합니다!"});
    }catch(err){
        console.error(err);
        res.status(500).json({message : "서버 에러"});
    }
}