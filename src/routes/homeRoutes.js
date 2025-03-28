const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/home', authMiddleware, homeController.getHomeData);

module.exports = router;
