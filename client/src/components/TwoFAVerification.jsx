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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Validar TOTP
        </h3>
        <p className="text-gray-600 text-sm">
          Por favor, introduzca 6 dígitos OTP basado en tiempo para verificar la autenticación 2FA
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TOTP
          </label>
          <input
            label="TOTP"
            value={otp}
            type="text"
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Introduzca su TOTP"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
        >
          Verificar TOTP
        </button>

        <button
          type="button"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 py-3 px-6 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
          onClick={handleReset}
        >
          Restablecer 2FA
        </button>
      </div>
    </form>
  );
};

export default TwoFAVerification;
