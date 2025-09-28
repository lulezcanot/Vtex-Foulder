import api from './api.js';

// Obtener todas las categorías
export const getCategories = async () => {
  return await api.get('/categories');
};

// Obtener una categoría por ID
export const getCategoryById = async (id) => {
  return await api.get(`/categories/${id}`);
};

// Crear una nueva categoría
export const createCategory = async (categoryData) => {
  return await api.post('/categories', categoryData);
};

// Actualizar una categoría
export const updateCategory = async (id, categoryData) => {
  return await api.put(`/categories/${id}`, categoryData);
};

// Eliminar una categoría
export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`);
};

// Obtener estadísticas de categorías
export const getCategoryStats = async () => {
  return await api.get('/categories/stats');
};
