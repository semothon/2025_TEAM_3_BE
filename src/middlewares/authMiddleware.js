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

    // JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰에 포함된 사용자 id로 DB에서 사용자 조회
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 사용자 정보를 req.user에 저장
    req.user = user;

    // 다음 미들웨어나 라우트 핸들러로 제어 전달
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    res.status(401).json({ error: '인증에 실패했습니다.' });
  }
};

module.exports = authMiddleware;
