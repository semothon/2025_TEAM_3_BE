const Groups = require('../models/Groups');
const GroupMembers = require('../models/GroupMembers');
const Records = require('../models/Records');
const RecordComment = require('../models/RecordComments');
const User = require('../models/User');
const ScheduleDetail = require('../models/ScheduleDetail');

exports.groupDetail = async (req, res) => {
  const userId = req.user?.id;
  try {
    const groupId = req.params.groupId;
    const group = await Groups.findByPk(groupId, {
      attributes: [
        'title',
        'approve',
        'meet',
        'attendance',
        'max_members',
        'num_members',
        'onelineDescription',
        'description',
        'memo',
        'thumbnail'
      ]
    });

    // ✅ 1. sharedRecords 전체 불러오기
    const rawSharedRecords = await Records.findAll({
      where: {
        group_id: groupId,
        is_shared: true
      },
      attributes: [
        'id', 'title', 'content', 'file_url', 'created_at',
        'likes', 'liked_user_ids', 'comments'
      ]
    });

    // ✅ 2. 댓글 전체 미리 조회 (N+1 방지)
    const allComments = await RecordComment.findAll({
      where: {
        record_id: rawSharedRecords.map(r => r.id)
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'profile_img']
      }],
      order: [['created_at', 'ASC']]
    });

    // ✅ 3. 댓글들을 기록별로 그룹핑
    const commentMapByRecord = {};
    allComments.forEach(comment => {
      const recordId = comment.record_id;
      if (!commentMapByRecord[recordId]) {
        commentMapByRecord[recordId] = [];
      }
      commentMapByRecord[recordId].push(comment);
    });

    // ✅ 4. sharedRecords에 likedByMe + 댓글 트리 포함
    const sharedRecords = rawSharedRecords.map(record => {
      const likedUsers = record.liked_user_ids || [];
      const likedByMe = userId != null
        ? likedUsers.some(id => Number(id) === Number(userId))
        : false;

      const recordComments = commentMapByRecord[record.id] || [];

      // 댓글 트리 구성
      const commentMap = new Map();
      const commentTree = [];

      recordComments.forEach(comment => {
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

      return {
        id: record.id,
        title: record.title,
        content: record.content,
        file_url: record.file_url,
        created_at: record.created_at,
        likes: record.likes,
        likedByMe,
        commentCount: record.comments,
        comments: commentTree
      };
    });

  const personalRecords = await Records.findAll({
    where: {
        group_id: groupId,
        is_shared: false
    },
    attributes: ['title', 'content','is_public', 'file_url', 'created_at']
  });

    const schedule = await ScheduleDetail.findAll({
      where: { group_id: groupId}
    })

    if(!group){
      return res.status(404).json({ error: "그룹을 찾을 수 없습니다." });
    }

    res.status(200).json({ group, schedule, sharedRecords, personalRecords });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
};

exports.createGroup = async (req, res) => {
  try{
    const { 
      title, 
      max_members, 
      goal, 
      description, 
      category, 
      is_public,
      major,
      field, 
      attendance, 
      meet, 
      mood, 
      approve 
    } = req.body;
    
    const leader_id = req.user && req.user.id;
    if(!leader_id){
      return res.status(401).json({ error: "로그인이 필요합니다." });
    }

    const thumbnail = req.body.thumbnail || '';

    const newGroup = await Groups.create({
      title,
      max_members,
      goal,
      description,
      category,
      is_public,
      field,
      major,
      attendance,
      meet,
      mood,
      approve,
      leader_id,
      thumbnail,
      num_members: 1,
    });

    await GroupMembers.create({
      user_id: leader_id,
      group_id: newGroup.id,
      role: 'leader',
      status: 'accepted',
      joined_at: new Date(),
    });

    res.status(201).json({ message: "그룹 생성", group: newGroup});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 에러"});
  }
};



