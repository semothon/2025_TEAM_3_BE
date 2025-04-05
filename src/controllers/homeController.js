const { Sequelize } = require('sequelize');
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
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const { start, end } = getTodayDateRange();

    // ✅ 쿼리 1: 오늘 일정
    const todaySchedulesQuery = `
      SELECT DISTINCT g.title AS group_title
      FROM schedule_detail sd
      JOIN group_members gm ON gm.group_id = sd.group_id
      JOIN \`groups\` g ON g.id = sd.group_id
      WHERE gm.user_id = :userId
      AND gm.status = 'accepted'
      AND sd.start_datetime BETWEEN :start AND :end
    `;
  

    const todaySchedules = await sequelize.query(todaySchedulesQuery, {
      replacements: { userId, start, end },
      type: Sequelize.QueryTypes.SELECT
    });

    // ✅ 쿼리 2: 다가오는 일정
    const upcomingSchedulesQuery = `
      SELECT sd.id, sd.title, sd.start_datetime, sd.location,
        TIMESTAMPDIFF(SECOND, NOW(), sd.start_datetime) AS seconds_left
      FROM schedule_detail sd
      JOIN group_members gm ON gm.group_id = sd.group_id
      WHERE gm.user_id = :userId
        AND gm.status = 'accepted'
        AND sd.start_datetime > NOW()
      ORDER BY sd.start_datetime ASC
      LIMIT 10
    `;

    const upcomingSchedules = await sequelize.query(upcomingSchedulesQuery, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });

    // ✅ 쿼리 3: 참여 중인 모임 정보
    const joinedGroupsQuery = `
      SELECT g.id, g.title, g.description, g.category, g.max_members,
             g.num_members, g.attendance, g.meet, g.mood
      FROM \`groups\` g
      JOIN group_members gm ON gm.group_id = g.id
      WHERE gm.user_id = :userId
        AND gm.status = 'accepted'
    `;

    const joinedGroups = await sequelize.query(joinedGroupsQuery, {
      replacements: { userId },
      type: Sequelize.QueryTypes.SELECT
    });

    // category에 따라 분류
    const studyGroups = joinedGroups.filter(g => g.category === 'study');
    const clubGroups = joinedGroups.filter(g => g.category === 'club');

    // 응답 반환
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
    console.error('🔥 homeController error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getScheduleDetail = async (req, res) => {
  try {
    const scheduleId = req.params.scheduleId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const query = `
      SELECT 
        sd.title,
        sd.start_datetime,
        sd.memo,
        sd.location,
        g.title AS group_title
      FROM schedule_detail sd
      JOIN \`groups\` g ON sd.group_id = g.id
      JOIN group_members gm ON gm.group_id = g.id
      WHERE sd.id = :scheduleId
        AND gm.user_id = :userId
        AND gm.status = 'accepted'
      LIMIT 1
    `;

    const [schedule] = await sequelize.query(query, {
      replacements: { scheduleId, userId },
      type: Sequelize.QueryTypes.SELECT
    });

    if (!schedule) {
      return res.status(404).json({ message: '일정을 찾을 수 없거나 권한이 없습니다.' });
    }

    res.status(200).json({ schedule });

  } catch (err) {
    console.error('🔥 getScheduleDetail error:', err.message);
    res.status(500).json({ message: '서버 에러', details: err.message });
  }
};
