# 🔐 Ejemplos de Autenticación - BugHunt API

## Flujo de Autenticación Completo

### 1. Registro de Usuario (Público)
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Login de Usuario
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

### 3. Usar Token en Requests Autenticados
```bash
# Guardar el token en una variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Crear un bug (requiere autenticación)
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Error en login",
    "description": "El botón de login no funciona en móviles"
  }'
```

### 4. Obtener Perfil del Usuario
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Actualizar Perfil
```bash
curl -X PUT http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Juan Carlos Pérez",
    "email": "juancarlos@example.com"
  }'
```

### 6. Cambiar Contraseña
```bash
curl -X PUT http://localhost:3000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

### 7. Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## 🔒 Roles y Permisos

### Roles Disponibles:
- `user` - Usuario básico (puede crear bugs, ver sus propios bugs)
- `developer` - Desarrollador (puede cambiar estado de bugs)
- `admin` - Administrador (acceso completo)

### Permisos por Endpoint:

#### Públicos (sin autenticación):
- `POST /api/users/register` - Registro de usuarios

#### Requieren Autenticación:
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Ver perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `POST /api/auth/logout` - Logout
- `POST /api/bugs` - Crear bug
- `GET /api/bugs` - Listar bugs
- `GET /api/bugs/:id` - Ver bug específico
- `POST /api/bugs/upload` - Subir screenshot

#### Solo Admin:
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Ver usuario específico

#### Admin y Developer:
- `PATCH /api/bugs/:id/status` - Cambiar estado de bug

## 🚨 Manejo de Errores de Autenticación

### Token No Proporcionado:
```json
{
  "success": false,
  "message": "Token de acceso requerido"
}
```

### Token Inválido:
```json
{
  "success": false,
  "message": "Token inválido"
}
```

### Token Expirado:
```json
{
  "success": false,
  "message": "Token expirado"
}
```

### Permisos Insuficientes:
```json
{
  "success": false,
  "message": "Permisos insuficientes",
  "required": ["admin"],
  "current": "user"
}
```

### Credenciales Inválidas:
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

## 📝 Variables de Entorno para JWT

```env
# JWT
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
```

**Importante:** 
- `JWT_SECRET` debe ser una cadena larga y aleatoria
- `JWT_EXPIRES_IN` puede ser: `1h`, `24h`, `7d`, etc.

## 🔧 Script de Prueba Completo

```bash
#!/bin/bash

# 1. Registrar usuario
echo "1. Registrando usuario..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo $REGISTER_RESPONSE

# 2. Hacer login
echo -e "\n2. Haciendo login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE

# 3. Extraer token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo -e "\n3. Token obtenido: ${TOKEN:0:50}..."

# 4. Crear bug
echo -e "\n4. Creando bug..."
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Bug de prueba",
    "description": "Este es un bug creado con autenticación"
  }'

echo -e "\n✅ Prueba completada!"
```
