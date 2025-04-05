const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Records = require('../models/Records');
const ScheduleDetail = require('../models/ScheduleDetail');
const { uploadFileToS3 } = require('../services/s3Service');
const { extractTimeExif } = require('../utils/exifService');
const GroupRanking = require('../models/Rankings');

exports.createRecords = async (req,res) => {
    try{
      const group_id = req.params.groupId;
      const {
        title,
        is_shared,
        is_public,
        content,
      } = req.body;

      const user_id = req.user && req.user.id;
      if(!user_id){
        return res.status(401).json({ message: "로그인이 필요합니다." });
      }

      let fileUrls = [];

      if(req.files && req.files.length > 0){
        fileUrls = await Promise.all(
          req.files.map(async (file) => {
            const fileName = `records/${Date.now()}_${file.originalname}`;
            const result = await uploadFileToS3(file.buffer, fileName, file.mimetype);
            return result.Location;
          })
        );
      } else {
        fileUrls = req.body.file_url || [];
      }

      let timeExif = null;
      if (req.files && req.files.length > 0 && req.files[0].buffer) {
        timeExif = extractTimeExif(req.files[0].buffer);
      }

      const newRecord = await Records.create({
        group_id,
        title,
        is_shared,
        is_public,
        content,
        user_id,
        file_url: fileUrls
      });

      if(timeExif && timeExif.DateTimeOriginal){
        const exifDate = new Date(timeExif.DateTimeOriginal * 1000);
        const exifDateString = exifDate.toISOString().split('T')[0];
      
        const schedule = await ScheduleDetail.findOne({
          where: {
            group_id,
            [Op.and]: Sequelize.where(Sequelize.fn('DATE', sequelize.col('start_datetime')), exifDateString)
          }
        });

        if(schedule) {
          await GroupRanking.increment('record_num', { where: { group_id }});
        }
      }

      res.status(201).json({ message: "기록 생성", record: newRecord});
    }catch (err){
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
  }

  
  
  exports.showRecords = async (req, res) => {
    try{
      const userId = req.user?.id;
      const recordId = req.params.recordId;
      const record = await Records.findOne({
        where: {
          id: recordId
        },
        attributes: [
          'title',
          'is_public',
          'is_shared',
          'content',
          'file_url',
          'created_at',
          'likes',
          'liked_user_ids'
        ]
      });


      const raw = record.liked_user_ids;
        
      const likedUsers = Array.isArray(raw) ? raw : [];
      const likedByMe = userId != null
        ? likedUsers.some(id => Number(id) === Number(userId))
        : false;

    const recordData = {
      ...record.toJSON(),
      likedByMe
    };
    delete recordData.liked_user_ids;

      if(!record || record.length == 0){
        return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
      }
  
      res.status(200).json({ record: recordData });
    }catch(err) {
      console.error(err);
        res.status(500).json({ message: "서버 에러" });
    }
  }

  exports.likeRecord = async (req, res) => {
    const userId = req.user?.id; // int
    const recordId = parseInt(req.params.recordId, 10);
  
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
  
    try {
      const record = await Records.findOne({ where: { id: recordId } });
  
      if (!record) {
        return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
      }
  
      const likedUsers = record.liked_user_ids;
  
      const hasLiked = likedUsers.includes(userId);
  
      if (hasLiked) {
        // 👎 좋아요 취소
        const updatedUsers = likedUsers.filter(id => id !== userId);
        await record.update({
          liked_user_ids: updatedUsers,
          likes: Math.max(0, record.likes - 1)
        });
        console.log(`👎 user ${userId} 좋아요 취소`);
        return res.status(200).json({ message: '좋아요 취소됨' });
      } else {
        // 👍 좋아요 추가
        likedUsers.push(userId);
        await record.update({
          liked_user_ids: sequelize.literal(`CAST('${JSON.stringify(likedUsers)}' AS JSON)`),
          likes: record.likes + 1
        });
        console.log(`👍 user ${userId} 좋아요 추가`);
        return res.status(200).json({ message: '좋아요 추가됨' });
      }
  
    } catch (err) {
      console.error('🔥 likeRecord error:', err);
      res.status(500).json({ message: '서버 에러', details: err.message });
    }
  };
  