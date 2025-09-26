import AuthMetrics from "../models/authMetrics.js";

class MetricsService {
  // Registrar una métrica de autenticación
  static async recordAuthMetric({
    userId,
    username,
    authType,
    success,
    responseTime = null,
    sessionId = null,
    ipAddress = null,
    userAgent = null,
    errorType = null,
  }) {
    try {
      const metric = new AuthMetrics({
        userId,
        username,
        authType,
        success,
        responseTime,
        sessionId,
        ipAddress,
        userAgent,
        errorType,
      });
      
      await metric.save();
      return metric;
    } catch (error) {
      console.error("Error recording auth metric:", error);
      throw error;
    }
  }

  // Calcular tasa de falsos positivos (intentos 2FA fallidos)
  static async getFalsePositiveRate(startDate = null, endDate = null, userId = null) {
    try {
      const matchConditions = {
        authType: "2fa_verify",
      };

      if (startDate && endDate) {
        matchConditions.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (userId) {
        matchConditions.userId = userId;
      }

      const result = await AuthMetrics.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            failedAttempts: {
              $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            totalAttempts: 1,
            failedAttempts: 1,
            falsePositiveRate: {
              $cond: [
                { $eq: ["$totalAttempts", 0] },
                0,
                { $multiply: [{ $divide: ["$failedAttempts", "$totalAttempts"] }, 100] },
              ],
            },
          },
        },
      ]);

      return result[0] || { totalAttempts: 0, failedAttempts: 0, falsePositiveRate: 0 };
    } catch (error) {
      console.error("Error calculating false positive rate:", error);
      throw error;
    }
  }

  // Calcular tasa de éxito de autenticación
  static async getAuthSuccessRate(startDate = null, endDate = null, userId = null) {
    try {
      const matchConditions = {
        authType: { $in: ["login", "2fa_verify"] },
      };

      if (startDate && endDate) {
        matchConditions.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (userId) {
        matchConditions.userId = userId;
      }

      const result = await AuthMetrics.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            successfulAttempts: {
              $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            totalAttempts: 1,
            successfulAttempts: 1,
            successRate: {
              $cond: [
                { $eq: ["$totalAttempts", 0] },
                0,
                { $multiply: [{ $divide: ["$successfulAttempts", "$totalAttempts"] }, 100] },
              ],
            },
          },
        },
      ]);

      return result[0] || { totalAttempts: 0, successfulAttempts: 0, successRate: 0 };
    } catch (error) {
      console.error("Error calculating auth success rate:", error);
      throw error;
    }
  }

  // Calcular tiempo promedio de respuesta de autenticación
  static async getAverageResponseTime(startDate = null, endDate = null, userId = null) {
    try {
      const matchConditions = {
        responseTime: { $exists: true, $ne: null },
        success: true,
      };

      if (startDate && endDate) {
        matchConditions.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (userId) {
        matchConditions.userId = userId;
      }

      const result = await AuthMetrics.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            averageResponseTime: { $avg: "$responseTime" },
            minResponseTime: { $min: "$responseTime" },
            maxResponseTime: { $max: "$responseTime" },
            totalSessions: { $sum: 1 },
          },
        },
      ]);

      return result[0] || {
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        totalSessions: 0,
      };
    } catch (error) {
      console.error("Error calculating average response time:", error);
      throw error;
    }
  }

  // Obtener métricas completas
  static async getCompleteMetrics(startDate = null, endDate = null, userId = null) {
    try {
      const [falsePositiveRate, successRate, responseTime] = await Promise.all([
        this.getFalsePositiveRate(startDate, endDate, userId),
        this.getAuthSuccessRate(startDate, endDate, userId),
        this.getAverageResponseTime(startDate, endDate, userId),
      ]);

      return {
        falsePositiveRate,
        successRate,
        responseTime,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error("Error getting complete metrics:", error);
      throw error;
    }
  }

  // Obtener métricas por período (diario, semanal, mensual)
  static async getMetricsByPeriod(period = "daily", limit = 30) {
    try {
      let groupBy;
      switch (period) {
        case "hourly":
          groupBy = {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
            hour: { $hour: "$timestamp" },
          };
          break;
        case "daily":
          groupBy = {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          };
          break;
        case "weekly":
          groupBy = {
            year: { $year: "$timestamp" },
            week: { $week: "$timestamp" },
          };
          break;
        case "monthly":
          groupBy = {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
          };
          break;
        default:
          groupBy = {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          };
      }

      const result = await AuthMetrics.aggregate([
        { $sort: { timestamp: -1 } },
        { $limit: limit * 100 }, // Limitar datos para evitar sobrecarga
        {
          $group: {
            _id: groupBy,
            totalAttempts: { $sum: 1 },
            successfulAttempts: {
              $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] },
            },
            failedAttempts: {
              $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] },
            },
            avgResponseTime: { $avg: "$responseTime" },
          },
        },
        {
          $project: {
            period: "$_id",
            totalAttempts: 1,
            successfulAttempts: 1,
            failedAttempts: 1,
            successRate: {
              $cond: [
                { $eq: ["$totalAttempts", 0] },
                0,
                { $multiply: [{ $divide: ["$successfulAttempts", "$totalAttempts"] }, 100] },
              ],
            },
            avgResponseTime: { $round: ["$avgResponseTime", 2] },
          },
        },
        { $sort: { "period.year": -1, "period.month": -1, "period.day": -1 } },
        { $limit: limit },
      ]);

      return result;
    } catch (error) {
      console.error("Error getting metrics by period:", error);
      throw error;
    }
  }
}

export default MetricsService;
