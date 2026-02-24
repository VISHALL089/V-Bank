const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const createTables = require('./init_db');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Create the tables on startup
createTables();

// Routes
// POST /signup, POST /login, POST /deposit, GET /balance, POST /send-money, POST /logout.
app.use('/', authRoutes);
app.use('/', accountRoutes);

app.get('/', (req, res) => {
    res.send('V Bank Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
