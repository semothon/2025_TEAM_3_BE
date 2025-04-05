const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search',authMiddleware, searchController.Search);

module.exports = router;