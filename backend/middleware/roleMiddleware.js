// Middleware to check if the user has one of the allowed roles
// allowedRoles should be an array of role IDs (e.g., [1] for Admin, [1, 2] for Admin or SuperAdmin))
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role_id) {
            // This should ideally not happen if authMiddleware runs first
            return res.status(401).json({ message: 'Authentication required.' });
        }

        const userRoleId = req.user.role_id;

        if (allowedRoles.includes(userRoleId)) {
            next(); // Role is allowed, proceed to the next middleware or route handler
        } else {
            res.status(403).json({ message: 'Forbidden: Insufficient permissions.' }); // User does not have the required role
        }
    };
};

module.exports = checkRole;
