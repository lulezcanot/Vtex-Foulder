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
  console.log("=== JWT Middleware Debug ===");
  console.log("Headers:", req.headers);
  
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);
  
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  console.log("Extracted Token:", token ? token.substring(0, 20) + "..." : "No token");

  if (!token) {
    console.log("No token found, checking session authentication...");
    // Si no hay token, verificar si está autenticado por sesión
    if (req.isAuthenticated()) {
      console.log("User authenticated by session");
      return next();
    }
    console.log("No session authentication, returning 401");
    return res.status(401).json({ message: "Unauthorized - No token or session" });
  }

  try {
    console.log("Verifying JWT with secret:", process.env.JWT_SECRET ? "Secret exists" : "No secret");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("JWT decoded successfully:", decoded);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found in database for ID:", decoded.userId);
      return res.status(401).json({ message: "User not found" });
    }
    
    console.log("User found:", user.username);
    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
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
