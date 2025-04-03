const express = require('express');
const router = express.Router();
const ScheduleController = require('../controllers/scheduleController');

router.post('/:groupId/createSchedule', ScheduleController.createSchedule);

module.exports = router;