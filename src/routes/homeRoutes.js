const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const homeController = require('../controllers/homeController')

router.get('/home', authMiddleware, homeController.getHomeData);

router.get('/home/schedule/:scheduleId', authMiddleware, homeController.getScheduleDetail);

module.exports = router;