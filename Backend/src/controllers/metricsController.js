import MetricsService from "../services/metricsService.js";

// Obtener métricas completas
export const getMetrics = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const metrics = await MetricsService.getCompleteMetrics(
      startDate,
      endDate,
      userId
    );
    
    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error getting metrics:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving metrics",
      error: error.message,
    });
  }
};

// Obtener tasa de falsos positivos
export const getFalsePositiveRate = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const falsePositiveRate = await MetricsService.getFalsePositiveRate(
      startDate,
      endDate,
      userId
    );
    
    res.status(200).json({
      success: true,
      data: falsePositiveRate,
    });
  } catch (error) {
    console.error("Error getting false positive rate:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving false positive rate",
      error: error.message,
    });
  }
};

// Obtener tasa de éxito de autenticación
export const getSuccessRate = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const successRate = await MetricsService.getAuthSuccessRate(
      startDate,
      endDate,
      userId
    );
    
    res.status(200).json({
      success: true,
      data: successRate,
    });
  } catch (error) {
    console.error("Error getting success rate:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving success rate",
      error: error.message,
    });
  }
};

// Obtener tiempo promedio de respuesta
export const getResponseTime = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    
    const responseTime = await MetricsService.getAverageResponseTime(
      startDate,
      endDate,
      userId
    );
    
    res.status(200).json({
      success: true,
      data: responseTime,
    });
  } catch (error) {
    console.error("Error getting response time:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving response time",
      error: error.message,
    });
  }
};

// Obtener métricas por período
export const getMetricsByPeriod = async (req, res) => {
  try {
    const { period = "daily", limit = 30 } = req.query;
    
    const metrics = await MetricsService.getMetricsByPeriod(
      period,
      parseInt(limit)
    );
    
    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error getting metrics by period:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving metrics by period",
      error: error.message,
    });
  }
};

// Obtener resumen de métricas para dashboard
export const getDashboardMetrics = async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      metrics24h,
      metrics7d,
      metrics30d,
      recentTrends
    ] = await Promise.all([
      MetricsService.getCompleteMetrics(last24Hours.toISOString(), now.toISOString()),
      MetricsService.getCompleteMetrics(last7Days.toISOString(), now.toISOString()),
      MetricsService.getCompleteMetrics(last30Days.toISOString(), now.toISOString()),
      MetricsService.getMetricsByPeriod("daily", 7)
    ]);

    res.status(200).json({
      success: true,
      data: {
        last24Hours: metrics24h,
        last7Days: metrics7d,
        last30Days: metrics30d,
        recentTrends,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error getting dashboard metrics:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving dashboard metrics",
      error: error.message,
    });
  }
};
