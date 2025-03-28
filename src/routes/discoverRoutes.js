const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const discoverController = require('../controllers/discoverController')

router.get('/discover', authMiddleware, discoverController.Discover);

module.exports = router;