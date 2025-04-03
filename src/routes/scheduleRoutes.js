const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');

router.post('/createSchedule', ScheduleController.createSchedule);

module.exports = router;