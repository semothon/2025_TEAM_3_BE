const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/database');
const Records = require('../models/Records');
const RecordComment = require('../models/RecordComments');
const ScheduleDetail = require('../models/ScheduleDetail');
const { uploadFileToS3 } = require('../services/s3Service');
const { extractTimeExif } = require('../utils/exifService');
const Ranking = require('../models/Ranking');

exports.createRecords = async (req,res) => {
    try{
      const group_id = req.params.groupId;
      const {
        title,
        content,
      } = req.body;

      const is_shared = req.body.is_shared === 'true';
      const is_public = req.body.is_public === 'true';

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
          await Ranking.increment('record_num', { where: { group_id }});

          const ranking = await Ranking.findOne({ where: { group_id } });
          const newRecordNum = ranking.record_num;
          let newTree = '0';
          let newFruitNum = 0;

          if (newRecordNum === 1) {
            newTree = '0';
            newFruitNum = 0;
          } else if (newRecordNum === 2) {
            newTree = '1';
            newFruitNum = 0;
          } else if (newRecordNum === 3) {
            newTree = '2';
            newFruitNum = 0;
          } else if (newRecordNum === 4) {
            newTree = '3';
            newFruitNum = 0;
          } else if (newRecordNum > 4) {
            newTree = '3';
            newFruitNum = newRecordNum - 4;
          }

          await ranking.update({ tree: newTree, fruit_num: newFruitNum });
        }
      }

      res.status(201).json({ message: "기록 생성", record: newRecord});
    }catch (err){
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

  exports.addComment = async (req, res) => {
    const userId = req.user?.id;
    const { recordId } = req.params;
    const { content, parent_id } = req.body;
  
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
  
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: '내용을 입력해주세요.' });
    }
  
    try {
      const newComment = await RecordComment.create({
        record_id: recordId,
        user_id: userId,
        content,
        parent_id: parent_id || null,
      });

      await Records.increment('comments', {
        by: 1,
        where: { id: recordId }
      });
  
      res.status(201).json({ message: '댓글이 등록되었습니다.', comment: newComment });
    } catch (err) {
      console.error('🔥 addComment error:', err);
      res.status(500).json({ message: '서버 에러', details: err.message });
    }
  };
  