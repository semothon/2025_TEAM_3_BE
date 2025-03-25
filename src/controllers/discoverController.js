const Groups = require('../models/Groups');

exports.Discover = async(req, res) =>{
    const category = req.query.category || 'all';
    try{
        let groups;
        if(category === 'all'){
            groups = await Groups.findAll();
        }else{
            groups = await Groups.findAll({
                where : {category}
            });
        }
        
        res.status(200).json({groups});
    }catch(err){
        console.error(err);
        res.status(500).json({error : "server err"});
    }
};