import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
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

// Middleware JWT para autenticación
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // Si no hay token, verificar si está autenticado por sesión
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

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
router.post("/2fa/setup", authenticateJWT, setup2FA);

// verify Route
router.post("/2fa/verify", authenticateJWT, verify2FA);

// Reset Route
router.post("/2fa/reset", authenticateJWT, reset2FA);

export default router;
