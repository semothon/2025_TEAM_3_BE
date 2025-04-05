const { Op } = require('sequelize');
const Groups = require('../models/Groups');
const GroupMembers = require('../models/GroupMembers');
const buildGroupFilter = require('../utils/buildGroupFilter');

exports.Search = async (req, res) => {
  try {
    const where = buildGroupFilter(req.query, { includeKeyword: true });
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

    let orderOption = [];
    if (req.user && req.user.id && pendingGroupIds.length) {
      orderOption.push([
        Groups.sequelize.literal(
          `CASE WHEN id IN (${pendingGroupIds.join(',')}) THEN 0 ELSE 1 END`
        ),
        'ASC'
      ]);
    }

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
