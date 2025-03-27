const { Op } = require('sequelize');
const Groups = require('../models/Groups');
const buildGroupFilter = require('../utils/buildGroupFilter');
const GroupMembers = require('../models/GroupMembers');

exports.Discover = async(req, res) =>{
    try{
        const where = buildGroupFilter(req.query);
        let pendingGroupIds = [];

        if(req.user && req.user.id){
            const userId = req.user.id;
            const pendingMemberships = await GroupMembers.findAll({
                attributes: ['group_id'],
                where: {
                    user_id: userId,
                    status: 'pending'
                }
            });
            pendingGroupIds = pendingMemberships.map(m => m.group_id);

            if(pendingGroupIds.length > 0){
                where.id = { [Op.notIn]: pendingGroupIds };
            }
        }

        const subject = req.user ? req.user.timetable : [];

        let orderOption = [];
        if(req.user && req.user.id){
            orderOption.push([
                Groups.sequelize.literal(
                    `CASE WHEN id IN (SELECT group_id FROM group_members WHERE user_id = ${userId} AND status = 'pending') THEN 0 ELSE 1 END`
                ),
                'ASC'
            ]);
        }
        if(subject.length){
            orderOption.push([
                Groups.sequelize.literal(
                    `CASE WHEN major IN ('${subject.join("','")}') THEN 0 ELSE 1 END`
                ),
                'ASC'
            ]);
        }
        const groups = await Groups.findAll({ 
            where,
            order: orderOption
         });

        res.status(200).json({groups});
    }catch(err){
        console.error(err);
        res.status(500).json({error : "server err"});
    }
};