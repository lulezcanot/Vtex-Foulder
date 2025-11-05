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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Activar la autenticación Two-Factor
        </h3>
        <p className="text-gray-600 text-sm">
          Escanee el siguiente código QR con su aplicación de autenticación
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        {response.qrCode ? (
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-card">
            <img
              src={response.qrCode}
              alt="2FA QR CODE"
              className="w-48 h-48 object-contain"
            />
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        )}
      </div>

      {/* Manual Code Section */}
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-500 text-sm">
            O introducir el código manualmente
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm text-center">{message}</p>
          </div>
        )}

        <input
          readOnly
          defaultValue=""
          value={response.secret}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-center font-mono text-sm cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          onClick={copyClipBoard}
          placeholder="Código de configuración manual"
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={onSetupSuccess}
        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
      >
        Continuar con la verificación
      </button>
    </div>
  );
};

export default TwoFASetup;
