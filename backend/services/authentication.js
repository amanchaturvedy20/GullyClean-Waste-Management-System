const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function generateToken(res,user) {
    const payload = {
        id: user._id,
        role: user.role
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 });
    return token;
}

const validateToken = (token) => {
    try{
        const payload = jwt.verify(token, secretKey);
        return { valid: true, payload };
    }
    catch(err) {
        console.error('Token validation error:', err);
        return { valid: false, error: err.message };
    }
}

module.exports = {
    generateToken, 
    validateToken
};

