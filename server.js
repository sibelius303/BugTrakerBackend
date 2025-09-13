import app from './src/app.js';
import { testConnection } from './src/config/db.js';
import { initializeDatabase } from './src/config/database-setup.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Configurar dotenv
dotenv.config();

const PORT = process.env.PORT || 3000;

// Crear directorio uploads si no existe
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Directorio uploads creado');
}

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Intentar conectar a la base de datos
    let dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('🔄 Base de datos no encontrada. Intentando inicializar automáticamente...');
      
      // Intentar inicializar la base de datos automáticamente
      const initialized = await initializeDatabase();
      
      if (!initialized) {
        console.error('❌ No se pudo inicializar la base de datos automáticamente.');
        console.error('💡 Ejecuta manualmente: npm run setup-db');
        process.exit(1);
      }
      
      // Verificar conexión después de la inicialización
      dbConnected = await testConnection();
      
      if (!dbConnected) {
        console.error('❌ No se pudo conectar después de la inicialización.');
        process.exit(1);
      }
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor BugHunt iniciado');
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log('📋 Endpoints disponibles:');
      console.log('   GET  / - Información de la API');
      console.log('   POST /api/users/register - Registro público');
      console.log('   POST /api/auth/login - Login');
      console.log('   GET  /api/auth/profile - Perfil del usuario');
      console.log('   POST /api/bugs - Crear bug (autenticado)');
      console.log('   GET  /api/bugs - Listar bugs (autenticado)');
      console.log('   GET  /api/bugs/:id - Obtener bug específico (autenticado)');
      console.log('   PATCH /api/bugs/:id - Editar bug (creador/admin)');
      console.log('   PATCH /api/bugs/:id/status - Actualizar estado (admin/dev)');
      console.log('   POST /api/bugs/upload - Subir screenshot (autenticado)');
      console.log('');
      console.log('💡 Asegúrate de configurar las variables de entorno en el archivo .env');
    });

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar servidor
startServer();
