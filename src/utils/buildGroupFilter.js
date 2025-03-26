const { Op } = require('sequelize');

const processParam = (param) => {
  if (param === 'all') return null;
  if (Array.isArray(param)) return param;
  if (typeof param === 'string') return param.trim();
  return param;
};

module.exports = function buildGroupFilter(query, options = {}) {
  const { keyword = '', category, field, attendance, meet, mood } = query;
  const { includeKeyword = false } = options;

  const filters = {
    category: processParam(category),
    field: processParam(field),
    attendance: processParam(attendance),
    meet: processParam(meet),
    mood: processParam(mood)
  };

  const where = {};

  Object.entries(filters).forEach(([key, val]) => {
    if (val) {
      where[key] = Array.isArray(val) ? { [Op.in]: val } : val;
    }
  });

  if (includeKeyword && keyword.trim()) {
    where.title = { [Op.like]: `%${keyword.trim()}%` };
  }

  return where;
};
