const router = require('express').Router();
const {userModel:user} = require('../models/user');

router.get('/getUser', async(req, res) => {
    try{
        const userData = await user.findOne({email:req.user.email})
        return res.status(200).json({success:true, data:userData})
    }catch(err){
        return res.status(400).json({success:false, error:err.message})
    }
})

module.exports = router;