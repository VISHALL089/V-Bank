const pool = require('./db');

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        const [rows] = await connection.query('SELECT 1 as result');
        console.log('Query result:', rows);
        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
}

testConnection();
