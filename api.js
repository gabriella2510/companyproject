// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4040',
});

export default API;
