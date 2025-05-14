const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    console.log(token);
    try {
        // Check if token starts with 'Bearer '
        let actualToken = token;
        if (token.startsWith('Bearer ')) {
            actualToken = token.split(' ')[1];
        }

        if (!actualToken) {
             return res.status(401).json({ message: 'Token format is invalid' });
        }

        const decoded = jwt.verify(actualToken, JWT_SECRET);

        // Add user from payload to request object
        req.user = decoded.user; // Contains { id, role_id, organization_id }
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
