#!/usr/bin/env node

import { initializeDatabase } from './src/config/database-setup.js';
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

console.log('🔧 BugHunt Database Setup');
console.log('========================');

// Verificar variables de entorno requeridas
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars.join(', '));
  console.error('💡 Asegúrate de configurar el archivo .env correctamente');
  process.exit(1);
}

console.log('📋 Configuración:');
console.log(`   Usuario: ${process.env.DB_USER}`);
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Base de datos: ${process.env.DB_NAME}`);
console.log(`   Puerto: ${process.env.DB_PORT || 5432}`);
console.log('');

// Inicializar base de datos
initializeDatabase()
  .then(success => {
    if (success) {
      console.log('');
      console.log('✅ ¡Base de datos inicializada exitosamente!');
      console.log('🚀 Ahora puedes ejecutar: npm start');
      process.exit(0);
    } else {
      console.log('');
      console.error('❌ Error inicializando la base de datos');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  });
