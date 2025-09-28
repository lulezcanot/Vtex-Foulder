import Category from '../models/category.js';
import Component from '../models/component.js';

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('createdBy', 'username')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Contar componentes en esta categoría
    const componentCount = await Component.countDocuments({ category: category._id });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        componentCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la categoría',
      error: error.message
    });
  }
};

// Crear una nueva categoría
export const createCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    // Verificar que no existe una categoría con el mismo nombre
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim(),
      color: color || '#8B5CF6',
      icon: icon || 'folder',
      createdBy: req.user._id
    });

    await category.save();
    await category.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la categoría',
      error: error.message
    });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar que el usuario es el creador de la categoría o es admin
    if (category.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar esta categoría'
      });
    }

    // Verificar que no existe otra categoría con el mismo nombre
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: name.trim(),
        _id: { $ne: category._id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con ese nombre'
        });
      }
    }

    // Actualizar campos
    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description?.trim();
    if (color) category.color = color;
    if (icon) category.icon = icon;

    await category.save();
    await category.populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la categoría',
      error: error.message
    });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    // Verificar que el usuario es el creador de la categoría
    if (category.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta categoría'
      });
    }

    // Verificar que no es una categoría por defecto
    if (category.isDefault) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar una categoría por defecto'
      });
    }

    // Verificar que no hay componentes usando esta categoría
    const componentCount = await Component.countDocuments({ category: category._id });
    if (componentCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la categoría porque tiene ${componentCount} componente(s) asociado(s)`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la categoría',
      error: error.message
    });
  }
};

// Obtener estadísticas de categorías
export const getCategoryStats = async (req, res) => {
  try {
    const stats = await Component.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          _id: '$category._id',
          name: '$category.name',
          color: '$category.color',
          icon: '$category.icon',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de categorías',
      error: error.message
    });
  }
};
