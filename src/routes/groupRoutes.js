const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const groupController = require('../controllers/groupController');

// // 그룹 상세 정보
router.get('/:groupId', authMiddleware, groupController.groupDetail);

// 그룹 생성
router.post('/',authMiddleware, groupController.createGroup);

// // 그룹 수정
// router.put('/:groupId', groupController.updateGroup);

// // 그룹 삭제
// router.delete('/:groupId', groupController.deleteGroup);



module.exports = router;
