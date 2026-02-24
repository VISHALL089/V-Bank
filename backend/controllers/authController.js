const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.signup = async (req, res) => {
    try {
        const { customer_name, customer_email, customer_phone, password } = req.body;

        if (!customer_name || !customer_email || !customer_phone || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO BankUser (customer_name, customer_email, customer_phone, password) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(query, [customer_name, customer_email, customer_phone, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully', customer_id: result.insertId });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const [rows] = await pool.query('SELECT * FROM BankUser WHERE customer_email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ customer_id: user.customer_id }, process.env.JWT_SECRET, { expiresIn: '20m' });

        // Token expiry time (20 minutes from now in ms)
        const expiryTime = Date.now() + 20 * 60 * 1000;

        // Save token to DB
        await pool.query('INSERT INTO BankUserJWT (token_value, customer_id, token_expiry_time) VALUES (?, ?, ?)', [token, user.customer_id, expiryTime]);

        // Send token as HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true if production
            sameSite: 'strict', // or 'lax' as per user request (Lax is default)
            maxAge: 20 * 60 * 1000 // 20 minutes
        });

        res.json({ message: 'Login successful', customer_id: user.customer_id });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            await pool.query('DELETE FROM BankUserJWT WHERE token_value = ?', [token]);
        }
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Logout failed' });
    }
};
