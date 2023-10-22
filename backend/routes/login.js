const router = require('express').Router();
const {generateToken} = require('../auth/JWTAuth');
const { userModel:user } = require('../models/user');
const bcrypt = require('bcrypt');
const invalidTokens = require('../auth/JWTAuth').invalidTokens;

router.post('/login', async (req, res) => {
    try {
        let body = req.body
        const userData = await user.findOne({ email: body.email });
        if (!userData) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        const validPassword = await bcrypt.compare(body.password, userData.password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Invalid password" })
        }
        const token = generateToken({ email: userData.email, userId: userData.userId });
        req.header['authorization'] = token;
        return res.status(200).json({ success: true, message: "User logged in successfully!" })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.post('/signup', async (req, res) => {
    try {
        let body = req.body
        let userData = await user.findOne({ email: body.email });
        if (userData) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = new user({
            userId: body.userId,
            email: body.email,
            password: hashedPassword
        });
        await newUser.save()
        return res.status(200).json({ success: true, message:"user created successfully!"})
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
})
router.get('/signout', async (req, res) => {
    try {
        let token = await req.header['authorization'];
        if(token){
            invalidTokens.add(token);
        }   
        return res.status(200).json({ success: true, message:"user logged out successfully!"})
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message })
    }
})

module.exports = {router:router};