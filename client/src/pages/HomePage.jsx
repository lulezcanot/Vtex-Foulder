import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { logoutUser } from "../service/authApi";
import MetricsTable from "../components/MetricsTable";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const [showMetrics, setShowMetrics] = useState(false);

  const handleLogout = async() => {
    try {
      const {data} = await logoutUser();
      logout(data);
      navigate("/login");
    } catch (error) {
    }
  }

  const handleShowMetrics = () => {
    setShowMetrics(true);
  };

  const handleCloseMetrics = () => {
    setShowMetrics(false);
  };

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-m mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Bienvenido, {user.username}!</h2>
        <p className="mb-6">Ha iniciado sesión correctamente y ha verificado su 2FA</p>
        
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={handleShowMetrics}
          >
            Métricas
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {showMetrics && <MetricsTable onClose={handleCloseMetrics} />}
    </>
  );
};

export default HomePage;
