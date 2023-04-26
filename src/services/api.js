import axios from 'axios';

const api = axios.create({
  baseURL: 'https://contause.digital/api',
});

export default api;  