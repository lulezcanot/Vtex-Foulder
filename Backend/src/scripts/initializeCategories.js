import mongoose from 'mongoose';
import Category from '../models/category.js';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const defaultCategories = [
  {
    name: 'UI Components',
    description: 'Componentes de interfaz de usuario básicos',
    color: '#8B5CF6',
    icon: 'component',
    isDefault: true
  },
  {
    name: 'Forms',
    description: 'Componentes relacionados con formularios',
    color: '#10B981',
    icon: 'form',
    isDefault: true
  },
  {
    name: 'Navigation',
    description: 'Componentes de navegación y menús',
    color: '#F59E0B',
    icon: 'navigation',
    isDefault: true
  },
  {
    name: 'Layout',
    description: 'Componentes de diseño y estructura',
    color: '#EF4444',
    icon: 'layout',
    isDefault: true
  },
  {
    name: 'Data Display',
    description: 'Componentes para mostrar datos',
    color: '#3B82F6',
    icon: 'data',
    isDefault: true
  }
];

const initializeCategories = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Conectado a MongoDB');

    // Buscar un usuario admin o el primer usuario
    const adminUser = await User.findOne().sort({ createdAt: 1 });
    if (!adminUser) {
      console.log('No se encontró ningún usuario. Crea un usuario primero.');
      return;
    }

    console.log(`Usando usuario: ${adminUser.username} como creador de categorías`);

    // Verificar si ya existen categorías
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log('Ya existen categorías en la base de datos');
      return;
    }

    // Crear categorías por defecto
    for (const categoryData of defaultCategories) {
      const category = new Category({
        ...categoryData,
        createdBy: adminUser._id
      });
      await category.save();
      console.log(`Categoría creada: ${category.name}`);
    }

    console.log('Categorías por defecto creadas exitosamente');
  } catch (error) {
    console.error('Error al inicializar categorías:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeCategories();
}

export default initializeCategories;
