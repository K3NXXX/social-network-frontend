import axios from 'axios';

const api = axios.create({
  baseURL: 'https://vetra-8c5dfe3bdee7.herokuapp.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
