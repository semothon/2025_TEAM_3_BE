const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const Records = require('../models/Records');
const RecordComment = require('../models/RecordComments');
const User = require('../models/User'); // 댓글 작성자 이름/프로필용

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

      const file_url = req.body.file_url || {};

      const newRecord = await Records.create({
        group_id,
        title,
        is_shared,
        is_public,
        content,
        user_id,
        file_url
      })

      res.status(201).json({ message: "기록 생성", record: newRecord});
    }catch (err){
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
  }
  
  exports.showRecords = async (req, res) => {
    try {
      const userId = req.user?.id;
      const recordId = req.params.recordId;
  
      const record = await Records.findOne({
        where: { id: recordId },
        attributes: [
          'title', 'is_public', 'is_shared', 'content',
          'file_url', 'created_at', 'likes', 'liked_user_ids'
        ]
      });
  
      if (!record) {
        return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
      }
  
      const likedUsers = record.liked_user_ids || [];

      const likedByMe = userId != null
        ? likedUsers.some(id => Number(id) === Number(userId))
        : false;
      
      const recordData = {
        ...record.toJSON(),
        likedByMe
      };
      delete recordData.liked_user_ids;
  
      const comments = await RecordComment.findAll({
        where: { record_id: recordId },
        include: [{
          model: User,
          as: 'user', // 여기 반드시 맞춰야 함
          attributes: ['id', 'name', 'profile_img']
        }]
      });
  
      const commentMap = new Map();
      const commentTree = [];
  
      comments.forEach(comment => {
        const item = {
          id: comment.id,
          user: {
            id: comment.user.id,
            name: comment.user.name,
            profile_img: comment.user.profile_img
          },
          content: comment.content,
          created_at: comment.created_at,
          replies: []
        };
  
        commentMap.set(comment.id, item);
  
        if (!comment.parent_id) {
          commentTree.push(item);
        } else {
          const parent = commentMap.get(comment.parent_id);
          if (parent) parent.replies.push(item);
        }
      });
  
      res.status(200).json({
        record: recordData,
        comments: commentTree
      });
  
    } catch (err) {
      console.error('🔥 showRecords error:', err);
      res.status(500).json({ message: "서버 에러", details: err.message });
    }
  };

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
  
      res.status(201).json({ message: '댓글이 등록되었습니다.', comment: newComment });
    } catch (err) {
      console.error('🔥 addComment error:', err);
      res.status(500).json({ message: '서버 에러', details: err.message });
    }
  };
  