import express from 'express';
import { registerUser, createUser, getUsers, getUserById } from '../controllers/user.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/register - Registro público de usuarios
router.post('/register', registerUser);

// POST /api/users - Crear usuario (solo admin)
router.post('/', authenticateToken, requireRole('admin'), createUser);

// GET /api/users - Listar usuarios (solo admin)
router.get('/', authenticateToken, requireRole('admin'), getUsers);

// GET /api/users/:id - Obtener usuario por ID (solo admin)
router.get('/:id', authenticateToken, requireRole('admin'), getUserById);

export default router;
