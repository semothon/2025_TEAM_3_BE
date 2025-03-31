const Friends = require('../models/Friends');
const Users = require('../models/User');

exports.showFriends = async (req, res) => {
    try{
        const userId = req.user.id;

        const myInfo = await Users.findByPk(userId, {
            attributes: ['id', 'name', 'department', 'profile_img']
        });
        if(!myInfo){
            return res.status(404).json({ message: '로그인 해주세요!' });
        }

        const friendsRequest = await Friends.findAll({
            where: {
                friend_id:userId,
                status: 'pending'
            }
        });
        const requestCount = friendsRequest.length;

        const friends = await Friends.findAll({
            where: {
              status: 'accepted',
              [Op.or]: [
                { user_id: userId },
                { friend_id: userId }
              ]
            }
        });
        const friendIds = friends.map(record => {
            return record.user_id === userId ? record.friend_id : record.user_id;
        });
        const friendsInfo = await Promise.all(
            friendIds.map(id =>
              Users.findByPk(id, { attributes: ['id', 'name', 'department', 'timetable'] })
            )
        );
        res.status(200).json({
            myInfo,
            requestCount,
            friendsInfo
          });
          
    }catch (err){
        console.error(err);
        res.status(500).json({ error: "server err" });
    }
}