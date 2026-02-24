const mysql = require('mysql2/promise');
require('dotenv').config();

// We use the connection string provided in .env
// Note: verify the SSL mode behavior with your specific driver version
const pool = mysql.createPool(process.env.DATABASE_URL);

module.exports = pool;
