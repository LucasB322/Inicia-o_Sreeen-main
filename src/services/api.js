import { API_CONFIG, API_ENDPOINTS } from "../config/api.config";

// Configuração da API
const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Função utilitária para fazer requisições HTTP
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Adicionar token de autenticação se existir
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erro ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.message || "Erro na requisição");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
};

/**
 * Serviços de Autenticação
 */
export const authService = {
  login: async (email, password) => {
    return request(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return request(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  },
};

/**
 * Serviços de Análise de Documentos
 */
export const analysisService = {
  submitAnalysis: async (formData) => {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ANALYSIS.SUBMIT}`;

    const token = localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData, // FormData já inclui Content-Type com boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Erro ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.message || "Erro ao enviar análise");
    }

    return await response.json();
  },

  /**
   * Obtém os resultados de uma análise concluída
   * @param {string} analysisId - ID da análise
   * @returns {Promise} - Retorna os resultados completos da análise
   */
  getAnalysisResults: async (analysisId) => {
    const token = localStorage.getItem("authToken");

    return request(API_ENDPOINTS.ANALYSIS.RESULTS(analysisId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Obtém o histórico de análises do usuário
   * @returns {Promise} - Retorna lista de análises
   */
  getAnalysisHistory: async () => {
    const token = localStorage.getItem("authToken");

    return request(API_ENDPOINTS.ANALYSIS.HISTORY, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  deleteAnalysis: async (id) => {
    const token = localStorage.getItem("authToken");

    return request(API_ENDPOINTS.ANALYSIS.DELETE(id), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Exporta os resultados de uma análise
   * @param {string} analysisId - ID da análise
   * @param {string} format - Formato de exportação (pdf, excel, json)
   * @returns {Promise} - Retorna o arquivo para download
   */
  exportResults: async (analysisId, format = "pdf") => {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ANALYSIS.EXPORT(analysisId, format)}`;
    const token = localStorage.getItem("authToken");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao exportar resultados");
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `analise_${analysisId}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

/**
 * Serviços de Perfil
 */
export const profileService = {
  getProfile: async () => {
    const token = localStorage.getItem("authToken");

    return request(API_ENDPOINTS.PROFILE.GET, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateProfile: async (profileData) => {
    const token = localStorage.getItem("authToken");
    return request(API_ENDPOINTS.PROFILE.UPDATE, {
      method: "PUT",
      body: JSON.stringify(profileData),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

const apiServices = {
  authService,
  analysisService,
  profileService,
};

export default apiServices;
