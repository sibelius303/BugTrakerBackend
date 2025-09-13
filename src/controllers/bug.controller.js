import { query } from '../config/db.js';
import { uploadImage } from '../config/cloudinary.js';

// Crear un nuevo bug
export const createBug = async (req, res) => {
  try {
    const { title, description } = req.body;
    const created_by = req.user.id; // Usar el usuario autenticado

    // Validar datos requeridos
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Título y descripción son requeridos'
      });
    }

    // Crear bug
    const result = await query(
      'INSERT INTO bugs (title, description, created_by) VALUES ($1, $2, $3) RETURNING id, title, description, status, created_by, created_at',
      [title, description, created_by]
    );

    const newBug = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Bug creado exitosamente',
      data: newBug
    });

  } catch (error) {
    console.error('Error creando bug:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Listar todos los bugs con información del creador y screenshots
export const getBugs = async (req, res) => {
  try {
    // Obtener bugs con información del creador
    const bugsResult = await query(`
      SELECT 
        b.id,
        b.title,
        b.description,
        b.status,
        b.created_at,
        u.name as creator_name,
        u.email as creator_email
      FROM bugs b
      JOIN users u ON b.created_by = u.id
      ORDER BY b.created_at DESC
    `);

    // Obtener screenshots para cada bug
    const bugsWithScreenshots = await Promise.all(
      bugsResult.rows.map(async (bug) => {
        const screenshotsResult = await query(
          'SELECT id, url, created_at FROM bug_screenshots WHERE bug_id = $1 ORDER BY created_at ASC',
          [bug.id]
        );

        return {
          ...bug,
          screenshots: screenshotsResult.rows
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Bugs obtenidos exitosamente',
      data: bugsWithScreenshots
    });

  } catch (error) {
    console.error('Error obteniendo bugs:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar estado de un bug
export const updateBugStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validar estado
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado inválido. Estados válidos: open, in_progress, resolved, closed'
      });
    }

    // Verificar que el bug existe
    const bugCheck = await query(
      'SELECT id FROM bugs WHERE id = $1',
      [id]
    );

    if (bugCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bug no encontrado'
      });
    }

    // Actualizar estado
    const result = await query(
      'UPDATE bugs SET status = $1 WHERE id = $2 RETURNING id, title, status, updated_at',
      [status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Estado del bug actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando estado del bug:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Subir screenshot y guardar URL en la base de datos
export const uploadScreenshot = async (req, res) => {
  try {
    const { bug_id } = req.body;

    // Validar que se proporcionó bug_id
    if (!bug_id) {
      return res.status(400).json({
        success: false,
        message: 'bug_id es requerido'
      });
    }

    // Verificar que el bug existe
    const bugCheck = await query(
      'SELECT id FROM bugs WHERE id = $1',
      [bug_id]
    );

    if (bugCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bug no encontrado'
      });
    }

    // Verificar que se subió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    // Subir imagen a Cloudinary
    const uploadResult = await uploadImage(req.file);

    if (!uploadResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error subiendo imagen',
        error: uploadResult.error
      });
    }

    // Guardar URL en la base de datos
    const result = await query(
      'INSERT INTO bug_screenshots (bug_id, url) VALUES ($1, $2) RETURNING id, bug_id, url, created_at',
      [bug_id, uploadResult.url]
    );

    res.status(201).json({
      success: true,
      message: 'Screenshot subido exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error subiendo screenshot:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un bug específico con screenshots
export const getBugById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener bug con información del creador
    const bugResult = await query(`
      SELECT 
        b.id,
        b.title,
        b.description,
        b.status,
        b.created_at,
        u.name as creator_name,
        u.email as creator_email
      FROM bugs b
      JOIN users u ON b.created_by = u.id
      WHERE b.id = $1
    `, [id]);

    if (bugResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bug no encontrado'
      });
    }

    // Obtener screenshots
    const screenshotsResult = await query(
      'SELECT id, url, created_at FROM bug_screenshots WHERE bug_id = $1 ORDER BY created_at ASC',
      [id]
    );

    const bug = {
      ...bugResult.rows[0],
      screenshots: screenshotsResult.rows
    };

    res.status(200).json({
      success: true,
      message: 'Bug obtenido exitosamente',
      data: bug
    });

  } catch (error) {
    console.error('Error obteniendo bug:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Editar un bug (título y descripción)
export const updateBug = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validar datos requeridos
    if (!title && !description) {
      return res.status(400).json({
        success: false,
        message: 'Al menos uno de los campos (título o descripción) es requerido'
      });
    }

    // Verificar que el bug existe y obtener información del creador
    const bugResult = await query(`
      SELECT 
        b.id,
        b.title,
        b.description,
        b.created_by,
        u.name as creator_name
      FROM bugs b
      JOIN users u ON b.created_by = u.id
      WHERE b.id = $1
    `, [id]);

    if (bugResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bug no encontrado'
      });
    }

    const bug = bugResult.rows[0];

    // Verificar permisos: solo el creador del bug o admin puede editarlo
    if (bug.created_by !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para editar este bug. Solo el creador o administradores pueden editarlo'
      });
    }

    // Construir query dinámicamente basado en los campos proporcionados
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramIndex}`);
      updateValues.push(title);
      paramIndex++;
    }

    if (description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      updateValues.push(description);
      paramIndex++;
    }

    // Agregar updated_at
    updateFields.push(`updated_at = NOW()`);
    
    // Agregar WHERE clause
    updateValues.push(id);

    const updateQuery = `
      UPDATE bugs 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING id, title, description, status, created_by, updated_at
    `;

    const result = await query(updateQuery, updateValues);

    res.status(200).json({
      success: true,
      message: 'Bug actualizado exitosamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error actualizando bug:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
