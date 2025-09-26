import React, { useState, useEffect } from "react";
import { getDashboardMetrics } from "../service/metricsApi";

const MetricsTable = ({ onClose }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await getDashboardMetrics();
      setMetrics(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError("Error al cargar las métricas");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return "N/A";
    return `${(milliseconds / 1000).toFixed(2)}s`;
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return "N/A";
    return `${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Cargando métricas...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Métricas de Autenticación</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button
              onClick={fetchMetrics}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Métricas de Autenticación 2FA</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Tasa de Falsos Positivos */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Tasa de Falsos Positivos
            </h3>
            <div className="text-3xl font-bold text-red-600">
              {formatPercentage(metrics?.last30Days?.falsePositiveRate?.falsePositiveRate)}
            </div>
            <p className="text-sm text-red-600 mt-2">
              {metrics?.last30Days?.falsePositiveRate?.failedAttempts || 0} fallos de {metrics?.last30Days?.falsePositiveRate?.totalAttempts || 0} intentos 2FA
            </p>
            <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
          </div>

          {/* Tasa de Éxito de Autenticación */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Tasa de Éxito de Autenticación
            </h3>
            <div className="text-3xl font-bold text-green-600">
              {formatPercentage(metrics?.last30Days?.successRate?.successRate)}
            </div>
            <p className="text-sm text-green-600 mt-2">
              {metrics?.last30Days?.successRate?.successfulAttempts || 0} éxitos de {metrics?.last30Days?.successRate?.totalAttempts || 0} intentos
            </p>
            <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
          </div>

          {/* Tiempo de Respuesta de Autenticación */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Tiempo de Respuesta Promedio
            </h3>
            <div className="text-3xl font-bold text-blue-600">
              {formatTime(metrics?.last30Days?.responseTime?.averageResponseTime)}
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Min: {formatTime(metrics?.last30Days?.responseTime?.minResponseTime)} | 
              Max: {formatTime(metrics?.last30Days?.responseTime?.maxResponseTime)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics?.last30Days?.responseTime?.totalSessions || 0} sesiones completadas
            </p>
          </div>
        </div>

        {/* Tabla de Métricas por Período */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Resumen por Período</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasa de Falsos Positivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasa de Éxito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiempo Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Intentos
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Últimas 24 horas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatPercentage(metrics?.last24Hours?.falsePositiveRate?.falsePositiveRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatPercentage(metrics?.last24Hours?.successRate?.successRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {formatTime(metrics?.last24Hours?.responseTime?.averageResponseTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metrics?.last24Hours?.successRate?.totalAttempts || 0}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Últimos 7 días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatPercentage(metrics?.last7Days?.falsePositiveRate?.falsePositiveRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatPercentage(metrics?.last7Days?.successRate?.successRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {formatTime(metrics?.last7Days?.responseTime?.averageResponseTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metrics?.last7Days?.successRate?.totalAttempts || 0}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Últimos 30 días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {formatPercentage(metrics?.last30Days?.falsePositiveRate?.falsePositiveRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    {formatPercentage(metrics?.last30Days?.successRate?.successRate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    {formatTime(metrics?.last30Days?.responseTime?.averageResponseTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metrics?.last30Days?.successRate?.totalAttempts || 0}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tendencias Recientes */}
        {metrics?.recentTrends && metrics.recentTrends.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tendencias Recientes (Últimos 7 días)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Intentos Totales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exitosos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fallidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tasa de Éxito
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiempo Promedio
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {metrics.recentTrends.map((trend, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trend.period?.day}/{trend.period?.month}/{trend.period?.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trend.totalAttempts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {trend.successfulAttempts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {trend.failedAttempts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPercentage(trend.successRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        {formatTime(trend.avgResponseTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>Datos generados el: {new Date(metrics?.generatedAt).toLocaleString()}</p>
          <button
            onClick={fetchMetrics}
            className="mt-2 text-blue-500 hover:text-blue-700 underline"
          >
            Actualizar métricas
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;
