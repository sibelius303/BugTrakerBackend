import express from 'express';
import { 
  login, 
  getProfile, 
  updateProfile, 
  changePassword, 
  logout 
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login - Login de usuario
router.post('/login', login);

// POST /api/auth/logout - Logout de usuario
router.post('/logout', authenticateToken, logout);

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticateToken, getProfile);

// PUT /api/auth/profile - Actualizar perfil del usuario
router.put('/profile', authenticateToken, updateProfile);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', authenticateToken, changePassword);

export default router;
