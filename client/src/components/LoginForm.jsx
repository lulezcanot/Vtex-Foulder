import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {register, loginUser} from "../service/authApi"

const LoginForm = ({onLoginSuccess}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const {data} = await loginUser(username, password);
      setMessage(data.message);
      setUsername("");
      setPassword("");
      setError("");
      onLoginSuccess(data)
    } catch (error) {
      setUsername("");
      setPassword("");
      setMessage("");
      setError("Credenciales inválidas. Verifica tu usuario y contraseña.");
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async(e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try{
      const {data} = await register(username, password);
      setIsRegister(false);
      setMessage(data.message);
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setError("");
    } catch (error) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setMessage("");
      setError("Error durante el registro. Intenta con otro nombre de usuario.");
    } finally {
      setLoading(false);
    }
  }

  const handleRegisterToggle = () => {
    setIsRegister(!isRegister);
    setError("");
    setMessage("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <form onSubmit={isRegister ? handleRegister: handleLogin} className="space-y-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <input
            value={username}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ingresa tu usuario"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ingresa tu contraseña"
            required
            disabled={loading}
          />
        </div>

        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              value={confirmPassword}
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Confirma tu contraseña"
              required
              disabled={loading}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-600 text-sm text-center">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{isRegister ? "Registrando..." : "Iniciando sesión..."}</span>
          </div>
        ) : (
          <span>{isRegister ? "Crear Cuenta" : "Iniciar Sesión"}</span>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600 text-sm">
          {isRegister 
            ? "¿Ya tienes una cuenta? "
            : "¿No tienes una cuenta? "}
          <button
            type="button"
            onClick={handleRegisterToggle}
            className="text-primary-600 font-medium hover:text-primary-700 underline underline-offset-2 cursor-pointer"
            disabled={loading}
          >
            {isRegister ? "Iniciar Sesión" : "Crear cuenta"}
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
