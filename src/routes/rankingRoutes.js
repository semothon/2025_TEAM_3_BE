const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const rankingController = require('../controllers/rankingController');

router.get('/ranking', authMiddleware, rankingController.getMainRanking);

module.exports = router;
