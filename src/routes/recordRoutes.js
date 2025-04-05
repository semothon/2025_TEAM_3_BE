const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const recordController = require('../controllers/recordController');

router.post('/:groupId/createRecord',authMiddleware,  recordController.createRecords);

router.post('/:recordId/like', authMiddleware, recordController.likeRecord);

router.post('/:recordId/comments', authMiddleware, recordController.addComment);

module.exports = router;