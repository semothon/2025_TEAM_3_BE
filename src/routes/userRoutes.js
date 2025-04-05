const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', userController.loginUser);

router.post('/register', userController.register);

router.get('/deleteId',authMiddleware, userController.deleteAccount);

router.get('/findId', userController.findId);

router.post('/requestReset', userController.findPass);

router.post('/resetPassword', userController.resetPass);

module.exports = router;