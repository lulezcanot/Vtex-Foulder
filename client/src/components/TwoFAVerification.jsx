import React, { useState } from "react";
import { reset2FA, verify2FA } from "../service/authApi";

const TwoFAVerification = ({onVerificationSuccess, onResetSuccess}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleTokenVerification = async (e) => {
    e.preventDefault();
    try{
        const {data} = await verify2FA(otp);
        onVerificationSuccess(data);
    } catch (error) {
        setOtp("");
        setError("Invalid TOTP token. Please try again.");
    }
  };

  const handleReset = async () => {
    try {
        const {data} = await reset2FA();
        onResetSuccess(data);
    } catch (error) {
        setError(error.message);
    }
  }

  return (
    <form onSubmit={handleTokenVerification} className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Validar TOTP
        </h3>
        <p className="text-purple-200 text-sm">
          Por favor, introduzca 6 dígitos OTP basado en tiempo para verificar la autenticación 2FA
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            TOTP
          </label>
          <input
            label="TOTP"
            value={otp}
            type="text"
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            placeholder="Introduzca su TOTP"
            required
          />
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          Verificar TOTP
        </button>

        <button
          type="button"
          className="w-full bg-slate-500/80 hover:bg-slate-500 text-white py-3 px-6 rounded-xl transition-colors font-medium backdrop-blur-sm"
          onClick={handleReset}
        >
          Restablecer 2FA
        </button>
      </div>
    </form>
  );
};

export default TwoFAVerification;
