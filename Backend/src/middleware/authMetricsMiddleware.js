import MetricsService from "../services/metricsService.js";
import User from "../models/user.js";

// Middleware para capturar intentos de login fallidos
export const captureLoginAttempts = (req, res, next) => {
  // Simplemente pasar al siguiente middleware por ahora
  // El registro de fallos se manejará en el passport strategy
  next();
};

// Middleware para capturar información de IP y User-Agent
export const captureRequestInfo = (req, res, next) => {
  // Obtener IP real del cliente (considerando proxies)
  req.clientIP =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  next();
};

// Middleware para limpiar sesiones expiradas
export const cleanupExpiredSessions = (req, res, next) => {
  // Limpiar timestamp de login si ha pasado mucho tiempo (más de 10 minutos)
  if (req.session.loginStartTime) {
    const now = Date.now();
    const timeDiff = now - req.session.loginStartTime;
    const tenMinutes = 10 * 60 * 1000; // 10 minutos en milisegundos

    if (timeDiff > tenMinutes) {
      delete req.session.loginStartTime;
    }
  }

  next();
};
