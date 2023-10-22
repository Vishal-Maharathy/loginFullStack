const router = require('express').Router();
const {user} = require('../models/user');

router.get('/getUser', async(req, res) => {
    try{
        const userData = await user.findOne({email:req.user.email})
        return res.status(200).json({success:true, data:userData})
        return res.status(200).json({success:true})
    }catch(err){
        return res.status(400).json({success:false, error:err.message})
    }
})

module.exports = router;