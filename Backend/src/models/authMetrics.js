import mongoose from "mongoose";

const authMetricsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    authType: {
      type: String,
      enum: ["login", "2fa_verify", "login_attempt"],
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
    responseTime: {
      type: Number, // en milisegundos
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
    errorType: {
      type: String,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para mejorar el rendimiento de las consultas
authMetricsSchema.index({ userId: 1, timestamp: -1 });
authMetricsSchema.index({ authType: 1, timestamp: -1 });
authMetricsSchema.index({ success: 1, timestamp: -1 });

const AuthMetrics = mongoose.model("AuthMetrics", authMetricsSchema);

export default AuthMetrics;
