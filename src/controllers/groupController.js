const Groups = require('../models/Groups');

exports.groupDetail = async (req, res) => {
  try {
    
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

    const newGroup = await Group.create({
      title,
      max_members,
      goal,
      description,
      category,
      is_public,
      field,
      attendance,
      meet,
      mood,
      approve,
      leader_id,
      thumbnail,
      num_members: 1,
    });

    res.status(201).json({ message: "그룹 생성", group: newGroup});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 에러"});
  }
}

exports.getSharedRecords = async (req, res) => {
  try{

  }catch (err) {

  }
}

exports.getPersonalRecords = async (req,res) => {
  try{

  }catch (err){

  }
}
