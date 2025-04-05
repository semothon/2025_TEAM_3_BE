const Records = require('../models/Records');

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

exports.getSharedRecords = async (req, res) => {
    try{
        const groupId = req.params.groupId;

        const sharedRecords = await Records.findAll({
            where: {
                group_id: groupId,
                is_shared: true
            },
            attributes: ['title', 'content', 'file_url', 'created_at']
        });
        
        res.status(200).json({ sharedRecords });
    }catch (err) {
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
  }
  
  exports.getPersonalRecords = async (req,res) => {
    try{
        const groupId = req.params.groupId;

        const personalRecords = await Records.findAll({
            where: {
                group_id: groupId,
                is_shared: false
            },
            attributes: ['title', 'content','is_public', 'file_url', 'created_at']
        });
        res.status(200).json({ personalRecords });
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
      console.log('🧩 userId:', userId, typeof userId);
      console.log('🧩 liked_user_ids raw:', raw);
        
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
          liked_user_ids: likedUsers,
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
  