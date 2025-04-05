const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');
const recordController = require('../controllers/recordController');

router.post('/:groupId/createRecord',authMiddleware, upload.array('files',5) , recordController.createRecords);

router.post('/:recordId/like', authMiddleware, recordController.likeRecord);

router.post('/:recordId/comments', authMiddleware, recordController.addComment);

module.exports = router;