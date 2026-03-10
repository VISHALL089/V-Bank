const mysql = require('mysql2/promise');
require('dotenv').config();

// Trim the DATABASE_URL to remove potential hidden characters like \r
const dbUrl = (process.env.DATABASE_URL || '').trim();

// Create the connection pool using the trimmed DATABASE_URL string.
const pool = mysql.createPool(dbUrl);

// Test connection on startup to catch errors early
pool.getConnection()
    .then(conn => {
        console.log('Successfully connected to the database.');
        conn.release();
    })
    .catch(err => {
        console.error('CRITICAL: Database connection failed during startup.');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.sqlMessage || err.message);
    });

module.exports = pool;
