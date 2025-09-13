# BugHunt Backend

Backend completo para una plataforma de reporte de bugs desarrollado con Node.js, Express y PostgreSQL.

## 🚀 Características

- **Base de datos**: PostgreSQL con tablas para usuarios, bugs y screenshots
- **Autenticación**: Sistema de usuarios con roles
- **Gestión de bugs**: Crear, listar y actualizar estado de bugs
- **Screenshots**: Subida de imágenes a Cloudinary
- **API REST**: Endpoints completos para todas las operaciones

## 📋 Requisitos

- Node.js 14+
- PostgreSQL 12+
- Cuenta de Cloudinary

## 🛠️ Instalación

1. **Clonar o descargar el proyecto**
2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   - Copia `env.example` a `.env`
   - Configura las variables de PostgreSQL y Cloudinary

4. **Configurar base de datos**:
   - Crea una base de datos PostgreSQL
   - Ejecuta el script `database.sql` para crear las tablas

5. **Iniciar el servidor**:
   ```bash
   npm start
   # o para desarrollo
   npm run dev
   ```

## 📁 Estructura del proyecto

```
bughunt-backend/
├── src/
│   ├── config/
│   │   ├── db.js              # Configuración PostgreSQL
│   │   └── cloudinary.js      # Configuración Cloudinary
│   ├── controllers/
│   │   ├── user.controller.js # Lógica de usuarios
│   │   └── bug.controller.js  # Lógica de bugs
│   ├── routes/
│   │   ├── user.routes.js     # Rutas de usuarios
│   │   └── bug.routes.js      # Rutas de bugs
│   └── app.js                 # Configuración Express
├── uploads/                   # Directorio temporal para archivos
├── server.js                  # Servidor principal
├── package.json
├── database.sql              # Script de creación de tablas
└── env.example               # Variables de entorno de ejemplo
```

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/logout` - Logout de usuario
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña

### Usuarios
- `POST /api/users/register` - Registro público de usuarios
- `POST /api/users` - Crear usuario (solo admin)
- `GET /api/users` - Listar usuarios (solo admin)
- `GET /api/users/:id` - Obtener usuario por ID (solo admin)

### Bugs
- `POST /api/bugs` - Crear bug (autenticado)
- `GET /api/bugs` - Listar bugs con screenshots (autenticado)
- `GET /api/bugs/:id` - Obtener bug específico (autenticado)
- `PATCH /api/bugs/:id/status` - Actualizar estado del bug (admin/dev)
- `POST /api/bugs/upload` - Subir screenshot (autenticado)

## 📊 Base de datos

### Tabla `users`
- `id` (PK) - Identificador único
- `name` - Nombre del usuario
- `email` - Email único
- `password_hash` - Contraseña encriptada
- `role` - Rol del usuario (default: 'user')
- `created_at` - Fecha de creación

### Tabla `bugs`
- `id` (PK) - Identificador único
- `title` - Título del bug
- `description` - Descripción detallada
- `status` - Estado (open, in_progress, resolved, closed)
- `created_by` (FK) - Referencia al usuario creador
- `created_at` - Fecha de creación

### Tabla `bug_screenshots`
- `id` (PK) - Identificador único
- `bug_id` (FK) - Referencia al bug
- `url` - URL de la imagen en Cloudinary
- `created_at` - Fecha de creación

## 🔧 Variables de entorno

```env
# Base de datos PostgreSQL
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
DB_HOST=localhost
DB_NAME=bughunt_db
DB_PORT=5432

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# Puerto del servidor
PORT=3000
```

## 📝 Ejemplos de uso

### Registro de usuario
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Crear bug (con autenticación)
```bash
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Error en login",
    "description": "El botón de login no funciona en móviles"
  }'
```

### Subir screenshot
```bash
curl -X POST http://localhost:3000/api/bugs/upload \
  -F "screenshot=@/path/to/image.jpg" \
  -F "bug_id=1"
```

## 🚨 Notas importantes

- Las contraseñas se encriptan con bcryptjs
- Las imágenes se suben a Cloudinary automáticamente
- Se incluye manejo de errores completo
- El proyecto usa ES Modules (import/export)
- Todas las consultas usan async/await
