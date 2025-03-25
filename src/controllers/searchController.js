const { Op } = require('sequelize');
const Groups = require('../models/Groups');

exports.Search = async (req, res) => {
  const {
    category = 'all',
    field = 'all',
    attendance = 'all',
    meet = 'all',
    mood = 'all'
  } = req.query;


  const processParam = (param) => {
    if (param === 'all') return null;
    if (Array.isArray(param)) return param;
    if (typeof param === 'string') {
      return param.trim();
    }
    return param;
  };


  const filters = {
    category: processParam(category),
    field: processParam(field),
    attendance: processParam(attendance),
    meet: processParam(meet),
    mood: processParam(mood),
  };


  const filter = {};

  Object.entries(filters).forEach(([key, val]) => {
    if (val) {
      filter[key] = Array.isArray(val) ? { [Op.in]: val } : val;
    }
  });

  try {
    const groups = await Groups.findAll({
      where: filter,
    });
    res.status(200).json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
};
