const db = require('../config/db');

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
    const userId = req.user.id; // Assuming user ID is stored in JWT token

    db.query('SELECT role FROM users WHERE id = ?', [userId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        if (results[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        next();
    });
};
