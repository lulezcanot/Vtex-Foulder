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
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Usuario
          </label>
          <input
            value={username}
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            placeholder="Ingresa tu usuario"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Contraseña
          </label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            placeholder="Ingresa tu contraseña"
            required
            disabled={loading}
          />
        </div>

        {isRegister && (
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Confirmar Contraseña
            </label>
            <input
              value={confirmPassword}
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              placeholder="Confirma tu contraseña"
              required
              disabled={loading}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3">
          <p className="text-red-200 text-sm text-center">{error}</p>
        </div>
      )}
      
      {message && (
        <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3">
          <p className="text-green-200 text-sm text-center">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
        <p className="text-purple-200 text-sm">
          {isRegister 
            ? "¿Ya tienes una cuenta? "
            : "¿No tienes una cuenta? "}
          <button
            type="button"
            onClick={handleRegisterToggle}
            className="text-white font-semibold hover:text-purple-200 transition-colors duration-200 underline underline-offset-2"
            disabled={loading}
          >
            {isRegister ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
