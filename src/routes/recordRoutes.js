const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const recordController = require('../controllers/recordController');

router.post('/:groupId/createRecord',authMiddleware,  recordController.createRecords);

router.get('/:recordId', authMiddleware, recordController.showRecords);

router.post('/:recordId/like', authMiddleware, recordController.likeRecord);

module.exports = router;