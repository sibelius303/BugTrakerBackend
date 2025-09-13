# 🚀 Instrucciones de Instalación Rápida - BugHunt Backend

## Pasos para ejecutar el proyecto:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia el archivo `env.example` a `.env` y configura tus credenciales:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus datos:
```env
# Base de datos PostgreSQL
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
DB_HOST=localhost
DB_NAME=bughunt_db
DB_PORT=5432

# Cloudinary (obtén estas credenciales en cloudinary.com)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Puerto del servidor
PORT=3000
```

### 3. Configurar PostgreSQL
1. Crea una base de datos llamada `bughunt_db`
2. Ejecuta el script SQL:
```bash
psql -U tu_usuario -d bughunt_db -f database.sql
```

### 4. Iniciar el servidor
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## ✅ Verificar que funciona

Visita `http://localhost:3000` en tu navegador. Deberías ver la información de la API.

## 📝 Pruebas rápidas

### Crear un usuario:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Crear un bug:
```bash
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bug de prueba",
    "description": "Este es un bug de prueba",
    "created_by": 1
  }'
```

### Listar bugs:
```bash
curl http://localhost:3000/api/bugs
```

## 🔧 Solución de problemas

- **Error de conexión a DB**: Verifica que PostgreSQL esté ejecutándose y las credenciales sean correctas
- **Error de Cloudinary**: Verifica que las credenciales de Cloudinary sean válidas
- **Puerto ocupado**: Cambia el puerto en el archivo `.env`
