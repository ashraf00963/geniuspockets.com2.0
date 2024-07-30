import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/geniuspockets_app2.0',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
