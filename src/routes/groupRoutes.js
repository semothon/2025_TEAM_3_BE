// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const groupController = require('../controllers/groupController');

// // 그룹 상세 정보
// router.get('/:groupId', groupController.groupDetail);

// // 공유 기록 목록
// router.get('/:groupId/share', groupController.getSharedRecords);

// // 개인 기록 목록
// router.get('/:groupId/personal', groupController.getPersonalRecords);

// 그룹 생성
router.post('/',authMiddleware, groupController.createGroup);

// // 그룹 수정
// router.put('/:groupId', groupController.updateGroup);

// // 그룹 삭제
// router.delete('/:groupId', groupController.deleteGroup);

module.exports = router;
