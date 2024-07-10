const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
        
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        console.log("token ", token);
        console.log("secret key: ", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        console.log("decoded user", req.user);
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' }); // 403 for Forbidden, as token is invalid
    }
};

module.exports = authenticateJWT;