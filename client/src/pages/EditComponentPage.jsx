import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getComponentById, updateComponent } from '../service/componentApi.js';
import { getCategories } from '../service/categoryApi.js';
import { logoutUser } from '../service/authApi.js';
import MetricsTable from '../components/MetricsTable.jsx';
import { useSession } from '../context/SessionContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const EditComponentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useSession();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showMetrics, setShowMetrics] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    files: []
  });

  useEffect(() => {
    loadCategories();
    loadComponent();
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const loadComponent = async () => {
    try {
      setLoading(true);
      const response = await getComponentById(id);
      const component = response.data.data;
      
      setFormData({
        name: component.name,
        description: component.description,
        category: component.category._id,
        tags: component.tags.join(', '),
        files: component.files
      });
    } catch (error) {
      console.error('Error al cargar componente:', error);
      showError('Error al cargar el componente');
      navigate('/components');
    } finally {
      setLoading(false);
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
      setSaving(true);
      
      const componentData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      await updateComponent(id, componentData);
      showSuccess('Componente actualizado exitosamente');
      navigate(`/components/${id}`);
    } catch (error) {
      console.error('Error al actualizar componente:', error);
      showError('Error al actualizar el componente');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">Editar Componente</h2>
            <p className="text-purple-200 text-sm mt-1">Modifica tu componente React personalizado</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Nombre del Componente *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ingresa el nombre del componente"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  required
                >
                  <option value="" className="bg-slate-800 text-white">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id} className="bg-slate-800 text-white">
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu componente"
                rows={3}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Tags (separados por comas)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="react, button, ui, component"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Files Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-white">
                  Archivos del Componente *
                </label>
                <button
                  type="button"
                  onClick={addFile}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  + Agregar Archivo
                </button>
              </div>

              <div className="space-y-4">
                {formData.files.map((file, index) => (
                  <div key={index} className="bg-white/5 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <input
                          type="text"
                          value={file.filename}
                          onChange={(e) => handleFileChange(index, 'filename', e.target.value)}
                          placeholder="Nombre del archivo"
                          className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                        />
                        <select
                          value={file.fileType}
                          onChange={(e) => handleFileChange(index, 'fileType', e.target.value)}
                          className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
                        >
                          {fileTypeOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-slate-800 text-white">
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
                            className="mr-2 text-purple-500 focus:ring-purple-400"
                          />
                          <span className="text-sm text-white">Archivo principal</span>
                        </label>
                      </div>
                      {formData.files.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
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
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent font-mono text-sm backdrop-blur-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
              <button
                type="button"
                onClick={() => navigate(`/components/${id}`)}
                className="px-6 py-3 border border-white/30 rounded-xl text-white hover:bg-white/10 transition-all duration-200 font-medium backdrop-blur-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </div>
                ) : (
                  'Guardar Cambios'
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

export default EditComponentPage;
