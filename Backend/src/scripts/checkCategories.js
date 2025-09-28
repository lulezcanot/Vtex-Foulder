import mongoose from 'mongoose';
import Category from '../models/category.js';
import User from '../models/user.js';
import dotenv from 'dotenv';

dotenv.config();

const checkCategories = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('✅ Conectado a MongoDB');

    // Verificar usuarios
    const users = await User.find();
    console.log(`👥 Usuarios encontrados: ${users.length}`);
    if (users.length > 0) {
      console.log(`   Primer usuario: ${users[0].username}`);
    }

    // Verificar categorías
    const categories = await Category.find();
    console.log(`📁 Categorías encontradas: ${categories.length}`);
    
    if (categories.length === 0) {
      console.log('⚠️  No hay categorías. Creando categorías por defecto...');
      
      if (users.length === 0) {
        console.log('❌ No se pueden crear categorías sin usuarios');
        return;
      }

      const defaultCategories = [
        {
          name: 'UI Components',
          description: 'Componentes de interfaz de usuario básicos',
          color: '#8B5CF6',
          icon: 'component',
          isDefault: true,
          createdBy: users[0]._id
        },
        {
          name: 'Forms',
          description: 'Componentes relacionados con formularios',
          color: '#10B981',
          icon: 'form',
          isDefault: true,
          createdBy: users[0]._id
        },
        {
          name: 'Navigation',
          description: 'Componentes de navegación y menús',
          color: '#F59E0B',
          icon: 'navigation',
          isDefault: true,
          createdBy: users[0]._id
        },
        {
          name: 'Layout',
          description: 'Componentes de diseño y estructura',
          color: '#EF4444',
          icon: 'layout',
          isDefault: true,
          createdBy: users[0]._id
        },
        {
          name: 'Data Display',
          description: 'Componentes para mostrar datos',
          color: '#3B82F6',
          icon: 'data',
          isDefault: true,
          createdBy: users[0]._id
        }
      ];

      for (const categoryData of defaultCategories) {
        const category = new Category(categoryData);
        await category.save();
        console.log(`✅ Categoría creada: ${category.name}`);
      }
      
      console.log('🎉 Categorías por defecto creadas exitosamente');
    } else {
      console.log('📋 Categorías existentes:');
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.color})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

checkCategories();
