import express from 'express';
import multer from 'multer';
import { 
  createBug, 
  getBugs, 
  updateBugStatus, 
  uploadScreenshot, 
  getBugById,
  updateBug
} from '../controllers/bug.controller.js';
import { authenticateToken, requireRole, requireOwnershipOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Configurar multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio temporal para archivos
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: function (req, file, cb) {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// POST /api/bugs - Crear bug (usuarios autenticados)
router.post('/', authenticateToken, createBug);

// GET /api/bugs - Listar bugs con screenshots y creador (usuarios autenticados)
router.get('/', authenticateToken, getBugs);

// GET /api/bugs/:id - Obtener bug específico (usuarios autenticados)
router.get('/:id', authenticateToken, getBugById);

// PATCH /api/bugs/:id - Editar bug (solo creador o admin)
router.patch('/:id', authenticateToken, updateBug);

// PATCH /api/bugs/:id/status - Actualizar estado del bug (solo admin y developer)
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'developer']), updateBugStatus);

// POST /api/bugs/upload - Subir screenshot (usuarios autenticados)
router.post('/upload', authenticateToken, upload.single('screenshot'), uploadScreenshot);

export default router;
