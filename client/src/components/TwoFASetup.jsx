import React, { useEffect, useState } from "react";
import { setup2FA } from "../service/authApi";

const TwoFASetup = ({ onSetupSuccess }) => {
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");

  const fetchQRCode = async () => {
    const { data } = await setup2FA();
    setResponse(data);
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  const copyClipBoard = async () => {
    await navigator.clipboard.writeText(response.secret);
    setMessage("¡Copiado en el Portapapeles!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Activar la autenticación Two-Factor
        </h3>
        <p className="text-purple-200 text-sm">
          Escanee el siguiente código Qr con su aplicación de autenticación
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        {response.qrCode ? (
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <img
              src={response.qrCode}
              alt="2FA QR CODE"
              className="w-48 h-48 object-contain"
            />
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Manual Code Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-1 border-t border-white/30"></div>
          <span className="px-4 text-purple-200 text-sm">
            QR introducir el código manualmente
          </span>
          <div className="flex-1 border-t border-white/30"></div>
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3">
            <p className="text-green-200 text-sm text-center">{message}</p>
          </div>
        )}

        <input
          readOnly
          defaultValue=""
          value={response.secret}
          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-center font-mono text-sm cursor-pointer hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
          onClick={copyClipBoard}
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={onSetupSuccess}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
      >
        Continuar con la verificación
      </button>
    </div>
  );
};

export default TwoFASetup;
