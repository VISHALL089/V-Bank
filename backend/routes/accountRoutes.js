const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/balance', authMiddleware, accountController.getBalance);
router.post('/deposit', authMiddleware, accountController.deposit);
router.post('/send-money', authMiddleware, accountController.sendMoney);

module.exports = router;
