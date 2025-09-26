import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  authStatus,
  setup2FA,
  verify2FA,
  reset2FA,
} from "../controllers/authController.js";
import {
  captureLoginAttempts,
  captureRequestInfo,
  cleanupExpiredSessions,
} from "../middleware/authMetricsMiddleware.js";

const router = Router();

// Aplicar middlewares globales para todas las rutas de autenticación
router.use(captureRequestInfo);
router.use(cleanupExpiredSessions);

// Registration Route
router.post("/register", register);

// Login Route - con middleware para capturar intentos fallidos
router.post("/login", captureLoginAttempts, passport.authenticate("local"), login);

// Auth Status Route
router.post("/status", authStatus);

// Logout Route
router.post("/logout", logout);

// 2FA setup
router.post(
  "/2fa/setup",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorizied" });
  },
  setup2FA
);

// verify Route
router.post(
  "/2fa/verify",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorizied" });
  },
  verify2FA
);

// Reset Route
router.post(
  "/2fa/reset",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorizied" });
  },
  reset2FA
);

export default router;
