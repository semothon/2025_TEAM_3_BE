const Groups = require('../models/Groups');

exports.GroupDetail = async (req, res) => {
  try {
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
};
