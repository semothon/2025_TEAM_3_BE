const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/api/login', userController.loginUser);

module.exports = router;