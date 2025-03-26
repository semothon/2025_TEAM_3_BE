const Groups = require('../models/Groups');
const buildGroupFilter = require('../utils/buildGroupFilter');

exports.Discover = async(req, res) =>{
    try{
        const where = buildGroupFilter(req.query);
        const groups = await Groups.findAll({ where });

        res.status(200).json({groups});
    }catch(err){
        console.error(err);
        res.status(500).json({error : "server err"});
    }
};