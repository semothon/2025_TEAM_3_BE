const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const homeController = require('../controllers/homeController')

router.get('/home', authMiddleware, homeController.getHomeData);

module.exports = router;