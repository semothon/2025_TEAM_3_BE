const express = require('express');
const router = express.Router();
const discoverController = require('../controllers/discoverController')

router.get('/discover', discoverController.Discover);

module.exports = router;