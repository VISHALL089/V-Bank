import axios from 'axios';

const api = axios.create({
    baseURL: 'https://v-bank.onrender.com',
    withCredentials: true,
});

export default api;
