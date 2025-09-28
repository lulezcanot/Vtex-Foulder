import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import MetricsService from "../services/metricsService.js";
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      isMfaActive: false,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user", message: error });
  }
};
export const login = async (req, res) => {
  try {
    // Registrar métrica de login exitoso
    await MetricsService.recordAuthMetric({
      userId: req.user._id,
      username: req.user.username,
      authType: "login",
      success: true,
      sessionId: req.sessionID,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    });

    // Guardar timestamp de inicio de sesión para calcular tiempo de respuesta total
    req.session.loginStartTime = Date.now();
    
    // Generar JWT para mantener autenticación
    const jwtToken = jwt.sign(
      { 
        userId: req.user._id,
        username: req.user.username,
        isMfaActive: req.user.isMfaActive
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
      token: jwtToken
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else {
    res.status(401).json({ message: "Unauthorized user" });
  }
};
export const logout = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized user" });
  }
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout" });
    }
    req.session.destroy((err) => {
      if(err){
        return res.status(500).json({ message: "Error destroying session" });
      }
      //clear cookie
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
};
export const setup2FA = async (req, res) => {
  try {
    const user = req.user;
    var secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await user.save();
    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "Vtex Foulder",
      encoding: "base32",
    });
    const qrImageUrl = await qrCode.toDataURL(url);
    res.status(200).json({
      secret: secret.base32,
      qrCode: qrImageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "Error setting up 2FA", message: error });
  }
};
export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;
    const verificationStartTime = Date.now();

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    // Calcular tiempo de respuesta total desde el login inicial
    let totalResponseTime = null;
    if (req.session.loginStartTime) {
      totalResponseTime = verificationStartTime - req.session.loginStartTime;
    }

    if (verified) {
      // Registrar métrica de 2FA exitoso
      await MetricsService.recordAuthMetric({
        userId: user._id,
        username: user.username,
        authType: "2fa_verify",
        success: true,
        responseTime: totalResponseTime,
        sessionId: req.sessionID,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
      });

      const jwtToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1hr" }
      );

      // Limpiar el timestamp de inicio de login
      delete req.session.loginStartTime;

      res.status(200).json({ message: "2FA successful", token: jwtToken });
    } else {
      // Registrar métrica de 2FA fallido (falso positivo)
      await MetricsService.recordAuthMetric({
        userId: user._id,
        username: user.username,
        authType: "2fa_verify",
        success: false,
        responseTime: totalResponseTime,
        sessionId: req.sessionID,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        errorType: "invalid_token",
      });

      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (error) {
    console.error("Error in verify2FA:", error);
    
    // Registrar métrica de error del sistema
    try {
      await MetricsService.recordAuthMetric({
        userId: req.user?._id,
        username: req.user?.username || "unknown",
        authType: "2fa_verify",
        success: false,
        sessionId: req.sessionID,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get("User-Agent"),
        errorType: "system_error",
      });
    } catch (metricsError) {
      console.error("Error recording metrics:", metricsError);
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
export const reset2FA = async (req, res) => {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;
    await user.save();
    res.status(200).json({ message: "2FA reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error resetting 2FA", message: error });
  }
};
