import api from "./api";

// Obtener métricas completas
export const getMetrics = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/metrics?${queryParams}` : '/metrics';
  return await api.get(url);
};

// Obtener tasa de falsos positivos
export const getFalsePositiveRate = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/metrics/false-positive-rate?${queryParams}` : '/metrics/false-positive-rate';
  return await api.get(url);
};

// Obtener tasa de éxito de autenticación
export const getSuccessRate = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/metrics/success-rate?${queryParams}` : '/metrics/success-rate';
  return await api.get(url);
};

// Obtener tiempo de respuesta
export const getResponseTime = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const url = queryParams ? `/metrics/response-time?${queryParams}` : '/metrics/response-time';
  return await api.get(url);
};

// Obtener métricas por período
export const getMetricsByPeriod = async (period = 'daily', limit = 30) => {
  return await api.get(`/metrics/by-period?period=${period}&limit=${limit}`);
};

// Obtener dashboard de métricas
export const getDashboardMetrics = async () => {
  return await api.get('/metrics/dashboard');
};
