const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const secretKey = process.env.SECRET_TOKEN_KEY // Replace with your secret key
const invalidTokens = new Set();

const authenticateToken = async function (req, res, next) {
    const token = await req.header['authorization'];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (invalidTokens.has(token)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Forbidden", error: err.message })
        }
        req.user = user;
        next();
    });
}

const generateToken = async function(user) {
    return jwt.sign(user, secretKey);
}
module.exports = {
    authenticateToken: authenticateToken,
    generateToken:generateToken,
    invalidTokens:invalidTokens
};
