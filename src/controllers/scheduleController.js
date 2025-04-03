const Schedules = require('../models/ScheduleDetail');

exports.createSchedule = async (req, res) => {
    try{
      const groupId = req.params.groupId;
      const {
        title,
        date,
        start_datetime,
        memo,
        location,
      } = req.body;
      const photo_url = req.body.photo_url || '';
      const new_schedule = await Schedules.create({
        group_id: groupId,
        title,
        date,
        start_datetime,
        memo,
        location,
        photo_url
      });

      res.status(201).json({ message: "스케줄 생성", schedule: new_schedule});
    }catch(err) {
      console.error(err);
      res.status(500).json({ error: "server err" });
    }
}