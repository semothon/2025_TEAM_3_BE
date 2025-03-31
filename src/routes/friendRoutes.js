const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const friendController = require('../controllers/friendController');

router.get('/show', authMiddleware, friendController.showFriends);

module.exports = router;
