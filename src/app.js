import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import bugRoutes from './routes/bug.routes.js';
import { initializeDatabase } from './config/database-setup.js';

// Configurar dotenv
dotenv.config();

const app = express();

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({ origin: '*' })); // temporal para pruebas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware para manejar errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB'
      });
    }
  }
  
  if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bugs', bugRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'BugHunt Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Login de usuario',
        'POST /api/auth/logout': 'Logout de usuario',
        'GET /api/auth/profile': 'Obtener perfil del usuario',
        'PUT /api/auth/profile': 'Actualizar perfil',
        'PUT /api/auth/change-password': 'Cambiar contraseña'
      },
      users: {
        'POST /api/users/register': 'Registro público de usuarios',
        'POST /api/users': 'Crear usuario (solo admin)',
        'GET /api/users': 'Listar usuarios (solo admin)',
        'GET /api/users/:id': 'Obtener usuario por ID (solo admin)'
      },
      bugs: {
        'POST /api/bugs': 'Crear bug (autenticado)',
        'GET /api/bugs': 'Listar bugs con screenshots (autenticado)',
        'GET /api/bugs/:id': 'Obtener bug específico (autenticado)',
        'PATCH /api/bugs/:id': 'Editar bug (solo creador o admin)',
        'PATCH /api/bugs/:id/status': 'Actualizar estado del bug (admin/dev)',
        'POST /api/bugs/upload': 'Subir screenshot (autenticado)'
      },
      setup: {
        'POST /api/setup/init-db': 'Inicializar base de datos (TEMPORAL)'
      }
    }
  });
});

// Endpoint temporal para inicializar la base de datos
app.post('/api/setup/init-db', async (req, res) => {
  try {
    console.log('🚀 Inicializando base de datos desde endpoint...');
    const initialized = await initializeDatabase();
    
    if (initialized) {
      res.json({
        success: true,
        message: 'Base de datos inicializada exitosamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al inicializar la base de datos'
      });
    }
  } catch (error) {
    console.error('Error inicializando DB:', error);
    res.status(500).json({
      success: false,
      message: 'Error al inicializar la base de datos',
      error: error.message
    });
  }
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
  });
});

export default app;
