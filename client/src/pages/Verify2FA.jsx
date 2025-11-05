import React from 'react'
import TwoFAVerification from '../components/TwoFAVerification'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext';

const Verify2FA = () => {
  const navigate = useNavigate();
  const { user } = useSession();

  const handleVerificationSuccess = () => {
    navigate("/");
  }

  const handleResetSuccess = () => {
    navigate("/setup-2fa");
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-xl mb-6">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Verificar 2FA
          </h1>
          <p className="text-gray-600">
            Ingresa el código de tu aplicación autenticadora
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-card p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Hola de nuevo, {user?.username}
            </h2>
            <p className="text-gray-600">
              Verifica tu identidad para acceder a tus componentes
            </p>
          </div>
          
          <TwoFAVerification 
            onVerificationSuccess={handleVerificationSuccess}
            onResetSuccess={handleResetSuccess}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Mantén tu código seguro y privado 🛡️
          </p>
        </div>
      </div>
    </div>
  )
}

export default Verify2FA
