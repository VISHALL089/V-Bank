const pool = require('../db');

exports.getBalance = async (req, res) => {
    try {
        const customer_id = req.user.customer_id;
        const [rows] = await pool.query('SELECT customer_id, customer_balance FROM BankUser WHERE customer_id = ?', [customer_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            account_number: rows[0].customer_id,
            balance: parseFloat(rows[0].customer_balance)
        });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({ message: 'Error fetching balance' });
    }
};

exports.deposit = async (req, res) => {
    try {
        const customer_id = req.user.customer_id;
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [rows] = await connection.query('SELECT customer_balance FROM BankUser WHERE customer_id = ? FOR UPDATE', [customer_id]);
            if (rows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'User not found' });
            }

            const currentBalance = parseFloat(rows[0].customer_balance);
            const depositAmount = parseFloat(amount);
            const newBalance = currentBalance + depositAmount;

            await connection.query('UPDATE BankUser SET customer_balance = ? WHERE customer_id = ?', [newBalance, customer_id]);

            await connection.commit();
            res.json({ message: 'Deposit successful', new_balance: newBalance });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ message: 'Error depositing money' });
    }
};

exports.sendMoney = async (req, res) => {
    try {
        const sender_id = req.user.customer_id;
        const { amount, receiver_account_number } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        if (!receiver_account_number) {
            return res.status(400).json({ message: 'Receiver account number required' });
        }
        if (sender_id == receiver_account_number) {
            return res.status(400).json({ message: 'Cannot send money to yourself' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Check sender
            const [senderRows] = await connection.query('SELECT customer_balance FROM BankUser WHERE customer_id = ? FOR UPDATE', [sender_id]);
            if (senderRows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Sender account not found' });
            }

            const senderBalance = parseFloat(senderRows[0].customer_balance);
            const transferAmount = parseFloat(amount);

            if (senderBalance < transferAmount) {
                await connection.rollback();
                return res.status(400).json({ message: 'Insufficient funds' });
            }

            // Check receiver
            const [receiverRows] = await connection.query('SELECT customer_id FROM BankUser WHERE customer_id = ? FOR UPDATE', [receiver_account_number]);
            if (receiverRows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Receiver account not found' });
            }

            // Perform transfer
            await connection.query('UPDATE BankUser SET customer_balance = customer_balance - ? WHERE customer_id = ?', [transferAmount, sender_id]);
            await connection.query('UPDATE BankUser SET customer_balance = customer_balance + ? WHERE customer_id = ?', [transferAmount, receiver_account_number]);

            await connection.commit();
            res.json({ message: 'Transfer successful' });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Send Money error:', error);
        res.status(500).json({ message: 'Error sending money' });
    }
};
