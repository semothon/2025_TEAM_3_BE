const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.loginUser);

router.post('/register', userController.register);

//router.get('');

module.exports = router;