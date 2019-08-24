const config = require('config');
const jwt = require('jsonwebtoken');
// User Model
const User = require('../models/User');

function auth(req, res, next) {
    const token = req.headers.token;
    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'), (err, decoded) => {
            if (err) {
                return res.status(401).send({ error: "Invalid token!" });
            }
            return decoded;
        });

        // Check if decoded user id exist
        const user = User.findOne({
            _id: decoded.id
        });

        if (!user) {
            res.status(401).send({ msg: '401 unauthorized!' });
        }

        next();
    } catch (e) {
        res.status(401).json({ error: "Invalid token!" });
    }
}

module.exports = auth;