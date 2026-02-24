import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [accountNumber, setAccountNumber] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [receiverAccount, setReceiverAccount] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const fetchBalance = async () => {
        try {
            const res = await api.get('/balance');
            setBalance(res.data.balance);
            setAccountNumber(res.data.account_number);
        } catch (err) {
            console.error(err);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/deposit', { amount: depositAmount });
            setMessage('Deposit successful');
            setDepositAmount('');
            fetchBalance();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Deposit failed');
        }
    };

    const handleSendMoney = async (e) => {
        e.preventDefault();
        try {
            await api.post('/send-money', {
                amount: sendAmount,
                receiver_account_number: receiverAccount
            });
            setMessage('Transfer successful');
            setSendAmount('');
            setReceiverAccount('');
            fetchBalance();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Transfer failed');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">V Bank</div>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </nav>

            <div className="dashboard-content">
                <div className="balance-card">
                    <h2>Account Overview</h2>
                    <div className="balance-info">
                        <div className="info-item">
                            <span className="label">Account Number</span>
                            <span className="value">{accountNumber}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Current Balance</span>
                            <span className="value">${balance.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {message && <div className="alert-message">{message}</div>}

                <div className="actions-grid">
                    <div className="action-card">
                        <h3>Deposit Money</h3>
                        <form onSubmit={handleDeposit}>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary full-width">Deposit</button>
                        </form>
                    </div>

                    <div className="action-card">
                        <h3>Send Money</h3>
                        <form onSubmit={handleSendMoney}>
                            <div className="form-group">
                                <label>Receiver Account Number</label>
                                <input
                                    type="text"
                                    value={receiverAccount}
                                    onChange={(e) => setReceiverAccount(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={sendAmount}
                                    onChange={(e) => setSendAmount(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary full-width">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
