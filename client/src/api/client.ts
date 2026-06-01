import axios from 'axios';

/**
 * Cliente API centralizado.
 * PHP Dev: Pense nisso como a configuração do seu Guzzle Client.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
