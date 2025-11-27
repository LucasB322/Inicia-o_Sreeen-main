/**
 * Configuração da API
 * 
 * Para usar em produção, defina a variável de ambiente REACT_APP_API_URL
 * ou modifique o valor padrão abaixo
 */

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  // Autenticação
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
  },
  
  // Análise
  ANALYSIS: {
    SUBMIT: '/api/analyze',
    RESULTS: (id) => `/api/reports/${id}`,
    HISTORY: '/api/reports',
    DELETE:  (id) => `/api/reports/${id}`
  },
  
  // Perfil
  PROFILE: {
    GET: '/api/auth/profile',
    UPDATE: '/api/auth/profile',
  },
};

export default API_CONFIG;

