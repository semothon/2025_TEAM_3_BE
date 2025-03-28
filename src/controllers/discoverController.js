const { Op } = require('sequelize');
const Groups = require('../models/Groups');
const buildGroupFilter = require('../utils/buildGroupFilter');
const GroupMembers = require('../models/GroupMembers');

exports.Discover = async (req, res) => {
  try {
    // 기본 필터 조건 구성 (쿼리 파라미터 기반)
    const where = buildGroupFilter(req.query);
    let pendingGroupIds = [];
    let acceptedGroupIds = [];

    if (req.user && req.user.id) {
      const userId = req.user.id;

      // 사용자가 이미 가입한(accepted) 그룹 조회
      const acceptedMembers = await GroupMembers.findAll({
        attributes: ['group_id'],
        where: {
          user_id: userId,
          status: 'accepted'
        }
      });
      acceptedGroupIds = acceptedMembers.map(m => m.group_id);

      // 사용자가 초대받은(pending) 그룹 조회
      const pendingMemberships = await GroupMembers.findAll({
        attributes: ['group_id'],
        where: {
          user_id: userId,
          status: 'pending'
        }
      });
      pendingGroupIds = pendingMemberships.map(m => m.group_id);

      // 가입한(accepted) 그룹은 결과에서 제외
      if (acceptedGroupIds.length > 0) {
        where.id = { [Op.notIn]: acceptedGroupIds };
      }
    }

    // 사용자의 시간표(예: ["기계학습", "미분적분학"]) 가져오기
    const subject = req.user ? req.user.timetable : [];

    let orderOption = [];
    // 1. pending 상태인 그룹은 상단에 정렬 (0으로 분류)
    if (req.user && req.user.id && pendingGroupIds.length) {
      orderOption.push([
        Groups.sequelize.literal(
          `CASE WHEN id IN (${pendingGroupIds.join(',')}) THEN 0 ELSE 1 END`
        ),
        'ASC'
      ]);
    }
    // 2. 사용자의 시간표(subject)에 포함된 major 값이 있는 그룹은 그 다음으로 정렬
    if (subject.length) {
      orderOption.push([
        Groups.sequelize.literal(
          `CASE WHEN major IN ('${subject.join("','")}') THEN 0 ELSE 1 END`
        ),
        'ASC'
      ]);
    }
    // 3. 기본적으로 생성일(created_at) 내림차순 정렬 (옵션)
    orderOption.push(['created_at', 'DESC']);

    const groups = await Groups.findAll({ 
      where,
      order: orderOption
    });

    res.status(200).json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
};
