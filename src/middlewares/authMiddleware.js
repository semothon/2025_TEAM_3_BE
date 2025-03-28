// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출 (예: "Bearer <token>")
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: '유효한 토큰이 아닙니다.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    
    req.user = user;

    
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    res.status(401).json({ error: '인증에 실패했습니다.' });
  }
};

module.exports = authMiddleware;
