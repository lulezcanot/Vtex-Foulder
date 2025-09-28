import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} from '../controllers/categoryController.js';
import { ensureAuthenticated } from '../middleware/authMetricsMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(ensureAuthenticated);

// GET /api/categories - Obtener todas las categorías
router.get('/', getCategories);

// GET /api/categories/stats - Obtener estadísticas de categorías
router.get('/stats', getCategoryStats);

// GET /api/categories/:id - Obtener una categoría específica
router.get('/:id', getCategoryById);

// POST /api/categories - Crear una nueva categoría
router.post('/', createCategory);

// PUT /api/categories/:id - Actualizar una categoría
router.put('/:id', updateCategory);

// DELETE /api/categories/:id - Eliminar una categoría
router.delete('/:id', deleteCategory);

export default router;
