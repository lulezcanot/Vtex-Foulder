import Component from '../models/component.js';
import Category from '../models/category.js';

// Obtener todos los componentes con filtros y búsqueda
export const getComponents = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      tags, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    let filter = {};
    
    // Filtro de búsqueda por texto
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Filtro por categoría
    if (category) {
      filter.category = category;
    }
    
    // Filtro por tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
    }

    // Opciones de paginación y ordenamiento
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'category', select: 'name color icon' },
        { path: 'createdBy', select: 'username' }
      ]
    };

    const components = await Component.find(filter)
      .populate('category', 'name color icon')
      .populate('createdBy', 'username')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Component.countDocuments(filter);

    res.json({
      success: true,
      data: components,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener componentes',
      error: error.message
    });
  }
};

// Obtener un componente por ID
export const getComponentById = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id)
      .populate('category', 'name color icon')
      .populate('createdBy', 'username');

    if (!component) {
      return res.status(404).json({
        success: false,
        message: 'Componente no encontrado'
      });
    }

    res.json({
      success: true,
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el componente',
      error: error.message
    });
  }
};

// Crear un nuevo componente
export const createComponent = async (req, res) => {
  try {
    const { name, description, category, tags, files, dependencies } = req.body;

    // Verificar que la categoría existe
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Categoría no válida'
      });
    }

    // Verificar que hay al menos un archivo principal
    const hasMainFile = files.some(file => file.isMain);
    if (!hasMainFile) {
      return res.status(400).json({
        success: false,
        message: 'Debe especificar un archivo principal'
      });
    }

    const component = new Component({
      name,
      description,
      category,
      tags: tags || [],
      files,
      dependencies: dependencies || [],
      createdBy: req.user._id
    });

    await component.save();
    await component.populate('category', 'name color icon');
    await component.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Componente creado exitosamente',
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el componente',
      error: error.message
    });
  }
};

// Actualizar un componente
export const updateComponent = async (req, res) => {
  try {
    const { name, description, category, tags, files, dependencies } = req.body;

    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({
        success: false,
        message: 'Componente no encontrado'
      });
    }

    // Verificar que el usuario es el creador del componente
    if (component.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este componente'
      });
    }

    // Verificar categoría si se proporciona
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Categoría no válida'
        });
      }
    }

    // Verificar archivo principal si se proporcionan archivos
    if (files) {
      const hasMainFile = files.some(file => file.isMain);
      if (!hasMainFile) {
        return res.status(400).json({
          success: false,
          message: 'Debe especificar un archivo principal'
        });
      }
    }

    // Actualizar campos
    if (name) component.name = name;
    if (description) component.description = description;
    if (category) component.category = category;
    if (tags) component.tags = tags;
    if (files) component.files = files;
    if (dependencies) component.dependencies = dependencies;

    await component.save();
    await component.populate('category', 'name color icon');
    await component.populate('createdBy', 'username');

    res.json({
      success: true,
      message: 'Componente actualizado exitosamente',
      data: component
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el componente',
      error: error.message
    });
  }
};

// Eliminar un componente
export const deleteComponent = async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({
        success: false,
        message: 'Componente no encontrado'
      });
    }

    // Verificar que el usuario es el creador del componente
    if (component.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este componente'
      });
    }

    await Component.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Componente eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el componente',
      error: error.message
    });
  }
};

// Obtener tags únicos
export const getTags = async (req, res) => {
  try {
    const tags = await Component.distinct('tags');
    res.json({
      success: true,
      data: tags.filter(tag => tag && tag.trim() !== '')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener tags',
      error: error.message
    });
  }
};
