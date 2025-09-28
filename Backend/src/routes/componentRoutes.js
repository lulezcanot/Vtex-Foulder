import express from 'express';
import {
  getComponents,
  getComponentById,
  createComponent,
  updateComponent,
  deleteComponent,
  getTags
} from '../controllers/componentController.js';
import { ensureAuthenticated } from '../middleware/authMetricsMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(ensureAuthenticated);

// GET /api/components - Obtener todos los componentes con filtros
router.get('/', getComponents);

// GET /api/components/tags - Obtener todos los tags únicos
router.get('/tags', getTags);

// GET /api/components/:id - Obtener un componente específico
router.get('/:id', getComponentById);

// POST /api/components - Crear un nuevo componente
router.post('/', createComponent);

// PUT /api/components/:id - Actualizar un componente
router.put('/:id', updateComponent);

// DELETE /api/components/:id - Eliminar un componente
router.delete('/:id', deleteComponent);

export default router;
