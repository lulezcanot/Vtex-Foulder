import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComponent } from '../service/componentApi.js';
import { getCategories } from '../service/categoryApi.js';
import { logoutUser } from '../service/authApi.js';
import MetricsTable from '../components/MetricsTable.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const AddComponentPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    files: [
      {
        filename: 'Component.jsx',
        content: `import React from 'react';

const Component = () => {
  return (
    <div>
      {/* Tu componente aquí */}
    </div>
  );
};

export default Component;`,
        fileType: 'jsx',
        isMain: true
      }
    ]
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.map((file, i) => 
        i === index ? { ...file, [field]: value } : file
      )
    }));
  };

  const addFile = () => {
    setFormData(prev => ({
      ...prev,
      files: [
        ...prev.files,
        {
          filename: 'NewFile.css',
          content: '',
          fileType: 'css',
          isMain: false
        }
      ]
    }));
  };

  const removeFile = (index) => {
    if (formData.files.length > 1) {
      setFormData(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== index)
      }));
    }
  };

  const setMainFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.map((file, i) => ({
        ...file,
        isMain: i === index
      }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      showError('Por favor completa todos los campos requeridos');
      return;
    }

    const hasMainFile = formData.files.some(file => file.isMain);
    if (!hasMainFile) {
      showError('Debe especificar un archivo principal');
      return;
    }

    try {
      setLoading(true);
      
      const componentData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      await createComponent(componentData);
      showSuccess('Componente creado exitosamente');
      navigate('/components');
    } catch (error) {
      console.error('Error al crear componente:', error);
      showError('Error al crear el componente');
    } finally {
      setLoading(false);
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

  const fileTypeOptions = [
    { value: 'jsx', label: 'JSX' },
    { value: 'tsx', label: 'TSX' },
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'less', label: 'LESS' },
    { value: 'json', label: 'JSON' }
  ];

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Agregar Nuevo Componente</h2>
            <p className="text-gray-600 text-sm mt-1">Crea y guarda tu componente React personalizado</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Componente *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingresa el nombre del componente"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu componente"
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (separados por comas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="react, button, ui, component"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Files Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Archivos del Componente *
                </label>
                <button
                  type="button"
                  onClick={addFile}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
                >
                  + Agregar Archivo
                </button>
              </div>

              <div className="space-y-4">
                {formData.files.map((file, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={file.filename}
                          onChange={(e) => handleFileChange(index, 'filename', e.target.value)}
                          placeholder="Nombre del archivo"
                          className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <select
                          value={file.fileType}
                          onChange={(e) => handleFileChange(index, 'fileType', e.target.value)}
                          className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {fileTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mainFile"
                            checked={file.isMain}
                            onChange={() => setMainFile(index)}
                            className="mr-2 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">Archivo principal</span>
                        </label>
                      </div>
                      {formData.files.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    <textarea
                      value={file.content}
                      onChange={(e) => handleFileChange(index, 'content', e.target.value)}
                      placeholder="Contenido del archivo..."
                      rows={10}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/components')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  'Guardar Componente'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Metrics Modal */}
      {showMetrics && <MetricsTable onClose={handleCloseMetrics} />}
    </div>
  );
};

export default AddComponentPage;
