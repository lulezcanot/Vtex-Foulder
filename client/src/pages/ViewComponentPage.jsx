import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getComponentById, deleteComponent } from '../service/componentApi.js';
import { logoutUser } from '../service/authApi.js';
import MetricsTable from '../components/MetricsTable.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ViewComponentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useSession();
  const { showSuccess, showError } = useToast();
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  useEffect(() => {
    loadComponent();
  }, [id]);

  const loadComponent = async () => {
    try {
      setLoading(true);
      const response = await getComponentById(id);
      setComponent(response.data.data);
      // Set main file as active by default
      const mainFileIndex = response.data.data.files.findIndex(file => file.isMain);
      setActiveFileIndex(mainFileIndex >= 0 ? mainFileIndex : 0);
    } catch (error) {
      console.error('Error al cargar componente:', error);
      showError('Error al cargar el componente');
      navigate('/components');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este componente?')) {
      try {
        await deleteComponent(id);
        showSuccess('Componente eliminado exitosamente');
        navigate('/components');
      } catch (error) {
        console.error('Error al eliminar componente:', error);
        showError('Error al eliminar el componente');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { data } = await logoutUser();
      logout(data);
      sessionStorage.removeItem('welcomeShown');
      navigate("/login");
    } catch (error) {
      showError('Error al cerrar sesión');
    }
  };

  const handleShowMetrics = () => {
    setShowMetrics(true);
  };

  const handleCloseMetrics = () => {
    setShowMetrics(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileLanguage = (fileType) => {
    const languageMap = {
      'jsx': 'javascript',
      'tsx': 'typescript',
      'js': 'javascript',
      'ts': 'typescript',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'json': 'json'
    };
    return languageMap[fileType] || 'text';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Componente no encontrado</h2>
          <button
            onClick={() => navigate('/components')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Volver a componentes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-white">
                VTEX Custom Components Portfolio
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/components')}
                className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Componentes
              </button>
              <button
                onClick={() => navigate('/components/add')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Add New
              </button>
              
              {/* User Actions */}
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-white/20">
                <span className="text-sm text-white font-medium">
                  Bienvenido {user?.username}
                </span>
                <button
                  onClick={handleShowMetrics}
                  className="text-purple-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Métricas
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm backdrop-blur-sm"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Component Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Información del Componente</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    Creado por
                  </label>
                  <p className="text-sm text-white">{component.createdBy?.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    Creado el
                  </label>
                  <p className="text-sm text-white">{formatDate(component.createdAt)}</p>
                </div>

                {component.updatedAt !== component.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                      Última edición
                    </label>
                    <p className="text-sm text-white">{formatDate(component.updatedAt)}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    Versión
                  </label>
                  <p className="text-sm text-white">v{component.version}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-1">
                    Categoría
                  </label>
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: component.category?.color || '#8B5CF6' }}
                  >
                    {component.category?.name || 'Sin categoría'}
                  </span>
                </div>

                {component.tags && component.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {component.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/20">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/components/${component._id}/edit`)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200 border border-red-400/50 backdrop-blur-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Component Details */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/20">
                <h1 className="text-2xl font-bold text-white">{component.name}</h1>
                <p className="text-purple-200 mt-2">{component.description}</p>
              </div>

              {/* File Tabs */}
              <div className="border-b border-white/20">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {component.files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFileIndex(index)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        index === activeFileIndex
                          ? 'border-purple-400 text-purple-300'
                          : 'border-transparent text-purple-200 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {file.filename}
                      {file.isMain && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/80 text-white backdrop-blur-sm">
                          Main
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* File Content */}
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">
                      {component.files[activeFileIndex]?.filename}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                      {component.files[activeFileIndex]?.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 overflow-x-auto border border-white/10">
                  <pre className="text-sm text-green-300 whitespace-pre-wrap">
                    <code className={`language-${getFileLanguage(component.files[activeFileIndex]?.fileType)}`}>
                      {component.files[activeFileIndex]?.content}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Modal */}
      {showMetrics && <MetricsTable onClose={handleCloseMetrics} />}
    </div>
  );
};

export default ViewComponentPage;
