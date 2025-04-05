const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const myPageController = require('../controllers/myPageController');

router.get('/mypage', authMiddleware, myPageController.myPage);

module.exports = router;