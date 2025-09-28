import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js"
import authRoutes from "./routes/authRoutes.js"
import metricsRoutes from "./routes/metricsRoutes.js"
import componentRoutes from "./routes/componentRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import "./config/passportConfig.js"

dotenv.config();
dbConnect();

const app = express();

// Trust proxy for Railway
app.set('trust proxy', 1);

// Middlewares
const corsOptions = {
  origin: [
    "http://localhost:3001", 
    "http://localhost:3002",
    "https://vtex-foulder.vercel.app",
    process.env.FRONTEND_URL
  ].filter(Boolean), // Filtrar valores undefined
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Para navegadores legacy
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60,
      secure: process.env.NODE_ENV === 'production', // HTTPS en producción
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Para dominios cruzados
      httpOnly: true
    },
  })
);
app.use(passport.initialize());
app.use(passport.session())

// ROUTES
app.use("/api/auth", authRoutes)
app.use("/api/metrics", metricsRoutes)
app.use("/api/components", componentRoutes)
app.use("/api/categories", categoryRoutes)

// Listen app
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
