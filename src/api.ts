import axios from 'axios';

// Pega a URL do backend a partir das variáveis de ambiente do Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 👈 A mágica está aqui! Isso garante que os cookies sejam enviados em TODAS as requisições.
});

// Você pode adicionar interceptors aqui para lidar com erros de forma global, se desejar.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Exemplo: Loga erros ou redireciona em caso de erro 401/403
    console.error('Erro na requisição da API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;