const pool = require('./db');

const createTables = async () => {
    try {
        const createBankUserTable = `
            CREATE TABLE IF NOT EXISTS BankUser (
                customer_id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) UNIQUE NOT NULL,
                customer_phone VARCHAR(20) NOT NULL,
                password VARCHAR(255) NOT NULL,
                customer_balance DECIMAL(15, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createBankUserJWTTable = `
            CREATE TABLE IF NOT EXISTS BankUserJWT (
                token_id INT AUTO_INCREMENT PRIMARY KEY,
                token_value TEXT NOT NULL,
                customer_id INT NOT NULL,
                token_expiry_time BIGINT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES BankUser(customer_id) ON DELETE CASCADE
            )
        `;

        await pool.query(createBankUserTable);
        await pool.query(createBankUserJWTTable);

        console.log('Tables created successfully (if not exists)');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

module.exports = createTables;
