# 🚀 BugHunt Backend - Setup Automático de Base de Datos

## ✨ ¡Nueva Funcionalidad! Setup Automático

Ya no necesitas ejecutar comandos SQL manualmente. El backend ahora puede crear automáticamente la base de datos y las tablas.

## 🛠️ Instalación y Configuración

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
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=localhost
DB_NAME=bugtracker
DB_PORT=5432

# Cloudinary
CLOUDINARY_CLOUD_NAME=dm7cvkdc7
CLOUDINARY_API_KEY=826314538168866
CLOUDINARY_API_SECRET=**********

# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# Puerto del servidor
PORT=3000
```

### 3. Opción A: Setup Automático (Recomendado)
```bash
npm start
```

El servidor detectará automáticamente si la base de datos no existe y la creará por ti.

### 3. Opción B: Setup Manual
```bash
npm run setup-db
```

Este comando creará la base de datos y las tablas sin iniciar el servidor.

### 4. Iniciar servidor
```bash
npm start
```

## 🎯 ¿Qué hace el setup automático?

El sistema automáticamente:

1. **🔍 Detecta** si la base de datos existe
2. **🏗️ Crea** la base de datos si no existe
3. **📋 Crea** todas las tablas necesarias:
   - `users` - Usuarios del sistema
   - `bugs` - Reportes de bugs
   - `bug_screenshots` - Screenshots de bugs
4. **🔗 Establece** todas las relaciones (Foreign Keys)
5. **⚡ Crea** índices para mejorar rendimiento
6. **🔄 Configura** triggers para actualizar timestamps automáticamente
7. **✅ Verifica** que todo funciona correctamente

## 🔧 Scripts Disponibles

- `npm start` - Inicia el servidor (con setup automático)
- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run setup-db` - Solo inicializa la base de datos

## 🚨 Requisitos Previos

- ✅ PostgreSQL instalado y ejecutándose
- ✅ Usuario PostgreSQL con permisos para crear bases de datos
- ✅ Variables de entorno configuradas correctamente

## 🎉 ¡Listo para Usar!

Una vez ejecutado `npm start`, tendrás:

- ✅ Base de datos creada automáticamente
- ✅ Todas las tablas configuradas
- ✅ Sistema de autenticación JWT funcionando
- ✅ API REST completa
- ✅ Subida de imágenes a Cloudinary
- ✅ Sistema de roles y permisos

## 📝 Pruebas Rápidas

### Registro de usuario:
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Crear bug (usar token del login):
```bash
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"title":"Bug de prueba","description":"Descripción del bug"}'
```

## 🔍 Solución de Problemas

### Error: "no existe la base de datos"
- ✅ **Solucionado automáticamente** - El sistema creará la BD por ti

### Error: "no existe la columna created_at"
- ✅ **Solucionado automáticamente** - Las tablas se crean con todas las columnas necesarias

### Error: "listen EADDRINUSE"
- El puerto 3000 está ocupado. Cambia el puerto en `.env` o mata el proceso:
```bash
taskkill /F /IM node.exe
```

### Error de conexión a PostgreSQL
- Verifica que PostgreSQL esté ejecutándose
- Verifica las credenciales en `.env`
- Asegúrate de que el usuario tenga permisos para crear bases de datos
