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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-center">
          <h2 className="text-2xl font-bold mb-4">Componente no encontrado</h2>
          <button
            onClick={() => navigate('/components')}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Volver a componentes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Vtex Folder
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/components')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                Componentes
              </button>
              <button
                onClick={() => navigate('/components/add')}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm cursor-pointer"
              >
                Agregar nuevo
              </button>
              
              {/* User Actions */}
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-700 font-medium">
                  Bienvenido {user?.username}
                </span>
                <button
                  onClick={handleShowMetrics}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Métricas
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm cursor-pointer"
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-card p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Componente</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Creado por
                  </label>
                  <p className="text-sm text-gray-900">{component.createdBy?.username}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Creado el
                  </label>
                  <p className="text-sm text-gray-900">{formatDate(component.createdAt)}</p>
                </div>

                {component.updatedAt !== component.createdAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Última edición
                    </label>
                    <p className="text-sm text-gray-900">{formatDate(component.updatedAt)}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Versión
                  </label>
                  <p className="text-sm text-gray-900">v{component.version}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                    {component.category?.name || 'Sin categoría'}
                  </span>
                </div>

                {component.tags && component.tags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {component.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/components/${component._id}/edit`)}
                      className="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border border-red-200 cursor-pointer"
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
            <div className="bg-white border border-gray-200 rounded-lg shadow-card overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">{component.name}</h1>
                <p className="text-gray-600 mt-2">{component.description}</p>
              </div>

              {/* File Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {component.files.map((file, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFileIndex(index)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${
                        index === activeFileIndex
                          ? 'border-gray-800 text-gray-900'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      {file.filename}
                      {file.isMain && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-white">
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
                    <span className="text-sm font-medium text-gray-900">
                      {component.files[activeFileIndex]?.filename}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {component.files[activeFileIndex]?.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200">
                  <pre className="text-sm text-green-400 whitespace-pre-wrap">
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
