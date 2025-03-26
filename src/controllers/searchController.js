const Groups = require('../models/Groups');
const buildGroupFilter = require('../utils/buildGroupFilter');

exports.Search = async (req, res) => {
  try {
    const where = buildGroupFilter(req.query, { includeKeyword: true });
    const groups = await Groups.findAll({ where });
    res.status(200).json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server err" });
  }
};
