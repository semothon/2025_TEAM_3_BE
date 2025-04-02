const Records = require('../models/Records');
const GroupMembers = require('../models/GroupMembers');
const Users = require('../models/User');

exports.myPage = async (req,res) =>{
    try {
      const userId = req.user.id;

      const myInfo = await Users.findByPk(userId, {
        attributes: ['id', 'name', 'department', 'profile_img', 'timetable']
      });

      const groupCount = await GroupMembers.count({
        where: {
          user_id: userId,
          status: 'accepted'
        }
      });

      const recordCount = await Records.count({
        where: { user_id: userId }
      });

      res.status(200).json({
        myInfo,
        groupCount,
        recordCount
      });
    }catch (err){
      console.error(err);
      res.status(500).json({ message: "서버 에러" });
    }
}

