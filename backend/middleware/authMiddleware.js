const jwt = require('jsonwebtoken');
const pool = require('../db');

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.customer_id) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Check if token exists in database and is not expired
        const [rows] = await pool.query('SELECT * FROM BankUserJWT WHERE token_value = ?', [token]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Session expired or invalidated' });
        }

        const tokenRecord = rows[0];
        if (tokenRecord.token_expiry_time < Date.now()) {
            // Optionally delete expired token here
            await pool.query('DELETE FROM BankUserJWT WHERE token_id = ?', [tokenRecord.token_id]);
            return res.status(401).json({ message: 'Token expired' });
        }

        req.user = { customer_id: decoded.customer_id };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateUser;
