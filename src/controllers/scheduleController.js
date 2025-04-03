const Schedules = require('../models/ScheduleDetail');

exports.createSchedule = async (req, res) => {
    try{
      const groupId = req.params.groupId;
      const {
        title,
        start_datetime,
        memo,
        location,
      } = req.body;
      const new_schedule = await Schedules.create({
        group_id: groupId,
        title,
        start_datetime,
        memo,
        location
      });

      res.status(201).json({ message: "스케줄 생성", schedule: new_schedule});
    }catch(err) {
      console.error(err);
      res.status(500).json({ error: "server err" });
    }
}