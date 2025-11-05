import React from 'react'
import LoginForm from '../components/LoginForm'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useSession();

  const handleLoginSuccess = (userData) => {
    login(userData);
    if(!userData.isMfaActive){
      navigate("/setup-2fa");
    } else {
      navigate("/verify-2fa");
    }
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
            Vtex Components
          </h1>
          <p className="text-gray-600">
            Portfolio de componentes React
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-card p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu biblioteca de componentes
            </p>
          </div>
          
          <LoginForm onLoginSuccess={handleLoginSuccess}/>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Desarrollado con ❤️ para la comunidad Vtex
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
