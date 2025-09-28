import api from './api.js';

// Obtener todos los componentes con filtros
export const getComponents = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });

  const queryString = queryParams.toString();
  const url = queryString ? `/components?${queryString}` : '/components';
  
  return await api.get(url);
};

// Obtener un componente por ID
export const getComponentById = async (id) => {
  return await api.get(`/components/${id}`);
};

// Crear un nuevo componente
export const createComponent = async (componentData) => {
  return await api.post('/components', componentData);
};

// Actualizar un componente
export const updateComponent = async (id, componentData) => {
  return await api.put(`/components/${id}`, componentData);
};

// Eliminar un componente
export const deleteComponent = async (id) => {
  return await api.delete(`/components/${id}`);
};

// Obtener todos los tags únicos
export const getTags = async () => {
  return await api.get('/components/tags');
};

// Buscar componentes
export const searchComponents = async (searchTerm, filters = {}) => {
  const params = {
    search: searchTerm,
    ...filters
  };
  return await getComponents(params);
};
