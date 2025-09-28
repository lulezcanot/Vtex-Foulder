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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Verificar 2FA
          </h1>
          <p className="text-purple-200 text-lg">
            Ingresa el código de tu aplicación autenticadora
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Hola de nuevo, {user?.username}
            </h2>
            <p className="text-purple-200">
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
          <p className="text-purple-300 text-sm">
            Mantén tu código seguro y privado 🛡️
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  )
}

export default Verify2FA
