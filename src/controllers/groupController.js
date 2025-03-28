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
    const { title, max_members, goal, description, category, is_public, field, attendance, meet, mood, approve} = req.body;
  } catch (err) {

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
