import React, { useState, useEffect } from 'react';
import { getTags } from '../service/componentApi.js';

const SearchBar = ({ categories, onSearch, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    search: '',
    category: '',
    tags: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await getTags();
      setAvailableTags(response.data.data);
    } catch (error) {
      console.error('Error al cargar tags:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      tags: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar componentes por nombre, descripción o contenido..."
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleInputChange('sortBy', sortBy);
              handleInputChange('sortOrder', sortOrder);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="createdAt-desc">Más recientes</option>
            <option value="createdAt-asc">Más antiguos</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="updatedAt-desc">Últimas modificaciones</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
        >
          {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
          <svg 
            className={`ml-1 h-4 w-4 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Limpiar filtros
          </button>
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (separados por comas)
              </label>
              <input
                type="text"
                placeholder="react, button, form..."
                value={filters.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {availableTags.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Tags disponibles:</div>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.slice(0, 10).map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const currentTags = filters.tags ? filters.tags.split(',').map(t => t.trim()) : [];
                          if (!currentTags.includes(tag)) {
                            const newTags = [...currentTags, tag].join(', ');
                            handleInputChange('tags', newTags);
                          }
                        }}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                    {availableTags.length > 10 && (
                      <span className="text-xs text-gray-500">+{availableTags.length - 10} más</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
