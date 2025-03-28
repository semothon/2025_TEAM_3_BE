const { Op, Sequelize } = require('sequelize');
const Groups = require('../models/Groups');
const GroupMembers = require('../models/GroupMembers');
const sequelize = require('../config/database');

const getTodayDateRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

exports.getHomeData = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { start, end } = getTodayDateRange();

    // 1. 오늘 일정 개수 + 모임 이름
    const todaySchedules = await sequelize.query(`
      SELECT DISTINCT g.title AS group_title
      FROM schedule_detail sd
      JOIN group_members gm ON gm.group_id = sd.group_id
      JOIN groups g ON g.id = sd.group_id
      WHERE gm.user_id = :userId
      AND gm.status = 'accepted'
      AND sd.date BETWEEN :start AND :end
    `, {
      replacements: { userId, start, end },
      type: Sequelize.QueryTypes.SELECT
    });

    // 2. 다가오는 일정 10개
    const upcomingSchedules = await sequelize.query(`
      SELECT sd.title, sd.start_datetime, sd.location,
        TIMESTAMPDIFF(SECOND, NOW(), sd.start_datetime) AS seconds_left
      FROM schedule_detail sd
      JOIN group_members gm ON gm.group_id = sd.group_id
      WHERE gm.user_id = :userId
        AND gm.status = 'accepted'
        AND sd.start_datetime > NOW()
      ORDER BY sd.start_datetime ASC
      LIMIT 10
    `, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });

    // 3. 참여중인 모임 정보
    const joinedGroups = await Groups.findAll({
      include: [{
        model: GroupMembers,
        where: {
          user_id: userId,
          status: 'accepted'
        },
        attributes: []
      }],
      attributes: [
        'id',
        'title',
        'description',
        'category',
        'max_members',
        'num_members',
        'attendance',
        'meet',
        'mood'
      ]
    });

    // 카테고리 분류
    const studyGroups = joinedGroups.filter(g => g.category === 'study');
    const clubGroups = joinedGroups.filter(g => g.category === 'club');

    res.status(200).json({
      todaySchedule: {
        count: todaySchedules.length,
        groupNames: todaySchedules.map(s => s.group_title)
      },
      upcomingSchedules,
      joinedGroups: {
        study: studyGroups,
        club: clubGroups
      }
    });

  } catch (err) {
    console.error('🔥 homeController error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
