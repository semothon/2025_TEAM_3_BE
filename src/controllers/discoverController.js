const { Op } = require('sequelize');
const Groups = require('../models/Groups');
const GroupMembers = require('../models/GroupMembers');
const Users = require('../models/User');
const buildGroupFilter = require('../utils/buildGroupFilter');
const { getGroupRecommendations } = require('../services/openaiService');

exports.Discover = async (req, res) => {
  try {
    const where = buildGroupFilter(req.query);
    let pendingGroupIds = [];
    let acceptedGroupIds = [];
  
    const userId = req.user.id;

    const acceptedMembers = await GroupMembers.findAll({
      attributes: ['group_id'],
      where: {
        user_id: userId,
        status: 'accepted'
      }
    });
    acceptedGroupIds = acceptedMembers.map(m => m.group_id);

    const pendingMemberships = await GroupMembers.findAll({
      attributes: ['group_id'],
      where: {
        user_id: userId,
        status: 'pending'
      }
    });
    pendingGroupIds = pendingMemberships.map(m => m.group_id);

    if (acceptedGroupIds.length > 0) {
      where.id = { [Op.notIn]: acceptedGroupIds };
    }

    const subject = req.user ? req.user.timetable : [];

    let orderOption = [];
    if (req.user && req.user.id && pendingGroupIds.length) {
      orderOption.push([
        Groups.sequelize.literal(
          `CASE WHEN id IN (${pendingGroupIds.join(',')}) THEN 0 ELSE 1 END`
        ),
        'ASC'
      ]);
    }
    if (subject.length) {
      orderOption.push([
        Groups.sequelize.literal(
          `CASE WHEN major IN ('${subject.join("','")}') THEN 0 ELSE 1 END`
        ),
        'ASC'
      ]);
    }
    orderOption.push(['created_at', 'DESC']);

    const groups = await Groups.findAll({ 
      where,
      order: orderOption
    });

    const user = await Users.findByPk(userId, {
      attributes: ['interest', 'hobby']
    });
    
    const acceptedGroups = await Groups.findAll({
      where: { id: acceptedGroupIds },
      attributes: ['major', 'description']
    });
    
    const groupInfoStrings = acceptedGroups.map(g => 
      `Major: ${g.major || 'N/A'}, Description: ${g.description || 'N/A'}`
    ).join('\n');

    const userInterest = user.interest ? JSON.stringify(user.interest) : "없음";
    const userHobby = user.hobby ? JSON.stringify(user.hobby) : "없음";

    const prompt = `나는 다음 그룹들에 가입해 있어:
${groupInfoStrings}
내 관심사는: ${userInterest}
내 취미는: ${userHobby}

이 정보를 바탕으로, 나와 비슷한 성향의 새로운 스터디 그룹 3개를 추천해줘.
각 추천 그룹에 대해 그룹 이름과 추천 이유를 JSON 형식으로 알려줘.
Please provide your response in strict JSON format
예시 응답:
[
  {"groupName": "그룹1", "reason": "추천 이유1"},
  {"groupName": "그룹2", "reason": "추천 이유2"},
  {"groupName": "그룹3", "reason": "추천 이유3"}
]`;

    const airecommendation = await getGroupRecommendations(prompt);
    res.status(200).json({ 
      groups
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
};
