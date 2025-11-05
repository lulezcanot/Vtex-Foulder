import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComponents, deleteComponent } from '../service/componentApi.js';
import { getCategories } from '../service/categoryApi.js';
import { logoutUser } from '../service/authApi.js';
import ComponentCard from '../components/ComponentCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import MetricsTable from '../components/MetricsTable.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const ComponentsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const { showSuccess, showError } = useToast();
  const [components, setComponents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMetrics, setShowMetrics] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    search: '',
    category: '',
    tags: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    loadCategories();
    // Mostrar toaster de bienvenida solo una vez
    if (user && !sessionStorage.getItem('welcomeShown')) {
      showSuccess(`¡Bienvenido, ${user.username}! Has iniciado sesión correctamente`, 5000);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [user, showSuccess]);

  useEffect(() => {
    loadComponents();
  }, [searchFilters]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadComponents = async () => {
    try {
      setLoading(true);
      const response = await getComponents(searchFilters);
      setComponents(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error al cargar componentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handleDeleteComponent = async (componentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este componente?')) {
      try {
        await deleteComponent(componentId);
        showSuccess('Componente eliminado exitosamente');
        loadComponents();
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

  const handleEditComponent = (componentId) => {
    navigate(`/components/${componentId}/edit`);
  };

  const handleViewComponent = (componentId) => {
    navigate(`/components/${componentId}`);
  };

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
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
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
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
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
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            categories={categories}
            onSearch={handleSearch}
            initialFilters={searchFilters}
          />
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Componentes</h2>
            <p className="text-gray-600 mt-1">
              {pagination.total} componente{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Components Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : components.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">No se encontraron componentes</div>
            <button
              onClick={() => navigate('/components/add')}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium cursor-pointer"
            >
              Crear tu primer componente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((component) => (
              <ComponentCard
                key={component._id}
                component={component}
                onEdit={handleEditComponent}
                onDelete={handleDeleteComponent}
                onView={handleViewComponent}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setSearchFilters(prev => ({ ...prev, page }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    page === pagination.current
                      ? 'bg-gray-800 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Modal */}
      {showMetrics && <MetricsTable onClose={handleCloseMetrics} />}
    </div>
  );
};

export default ComponentsPage;
