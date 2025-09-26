import { Router } from "express";
import {
  getMetrics,
  getFalsePositiveRate,
  getSuccessRate,
  getResponseTime,
  getMetricsByPeriod,
  getDashboardMetrics,
} from "../controllers/metricsController.js";

const router = Router();

// Middleware para verificar autenticación (opcional: solo para admins)
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Rutas de métricas
router.get("/", requireAuth, getMetrics);
router.get("/false-positive-rate", requireAuth, getFalsePositiveRate);
router.get("/success-rate", requireAuth, getSuccessRate);
router.get("/response-time", requireAuth, getResponseTime);
router.get("/by-period", requireAuth, getMetricsByPeriod);
router.get("/dashboard", requireAuth, getDashboardMetrics);

export default router;
