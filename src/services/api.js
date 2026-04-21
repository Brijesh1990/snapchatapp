import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:5000/api'
});

API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('snapUser'));
    if (user && user.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export default API;
