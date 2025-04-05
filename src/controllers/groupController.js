const Groups = require('../models/Groups');
const GroupMembers = require('../models/GroupMembers');
const ScheduleDetail = require('../models/ScheduleDetail');

exports.groupDetail = async (req, res) => {
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

    const schedule = await ScheduleDetail.findAll({
      where: { group_id: groupId}
    })

    if(!group){
      return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
    }

    res.status(200).json({ group, schedule });

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
      return res.status(401).json({ message: "로그인이 필요합니다." });
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
    res.status(500).json({ message: "서버 에러"});
  }
};



