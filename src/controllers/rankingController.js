const Ranking = require('../models/Ranking');
const Groups = require('../models/Groups');
const GroupMembers = require('../models/GroupMembers');

exports.getMainRanking = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // ✅ 내가 속한 그룹들
    const myGroups = await GroupMembers.findAll({
      where: { user_id: userId, status: 'accepted' },
      attributes: ['group_id']
    });

    const myGroupIds = myGroups.map(g => g.group_id);

    const myRankings = await Ranking.findAll({
      where: { group_id: myGroupIds },
      include: [{
        model: Groups,
        as: 'Group',
        attributes: ['title'],
        required: true
      }]
    });

    const myGroupRanking = myRankings.map(r => ({
      group_id: r.group_id,
      title: r.Group.title,
      record_num: r.record_num,
      fruit_num: r.fruit_num,
      tree: r.tree,
      category: r.category
    }));

    // ✅ 전체 스터디 랭킹
    const studyRankings = await Ranking.findAll({
      where: { category: 'study' },
      include: [{
        model: Groups,
        as: 'Group',
        attributes: ['title'],
        required: true
      }],
      order: [['record_num', 'DESC'], ['fruit_num', 'DESC']]
    });

    const studyGroupRanking = studyRankings.map(r => ({
      group_id: r.group_id,
      title: r.Group.title,
      record_num: r.record_num,
      fruit_num: r.fruit_num,
      tree: r.tree
    }));

    // ✅ 전체 소모임 랭킹
    const clubRankings = await Ranking.findAll({
      where: { category: 'club' },
      include: [{
        model: Groups,
        as: 'Group',
        attributes: ['title'],
        required: true
      }],
      order: [['record_num', 'DESC'], ['fruit_num', 'DESC']]
    });

    const clubGroupRanking = clubRankings.map(r => ({
      group_id: r.group_id,
      title: r.Group.title,
      record_num: r.record_num,
      fruit_num: r.fruit_num,
      tree: r.tree
    }));

    // ✅ 응답
    res.status(200).json({
      myGroups: myGroupRanking,
      studyRanking: studyGroupRanking,
      clubRanking: clubGroupRanking
    });

  } catch (err) {
    console.error('🔥 getMainRanking error:', err);
    res.status(500).json({ message: '서버 에러', details: err.message });
  }
};
