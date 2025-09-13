# 📊 Datos de Ejemplo para BugHunt API

## Usuarios de ejemplo

### Usuario 1 - Administrador
```json
{
  "name": "Admin User",
  "email": "admin@bughunt.com",
  "password": "admin123",
  "role": "admin"
}
```

### Usuario 2 - Desarrollador
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "developer"
}
```

### Usuario 3 - Tester
```json
{
  "name": "María García",
  "email": "maria@example.com",
  "password": "password123",
  "role": "tester"
}
```

## Bugs de ejemplo

### Bug 1 - Error de Login
```json
{
  "title": "Error en formulario de login",
  "description": "El botón de login no responde cuando se hace clic en dispositivos móviles. El problema ocurre específicamente en iOS Safari.",
  "created_by": 2
}
```

### Bug 2 - Problema de Rendimiento
```json
{
  "title": "Carga lenta en página principal",
  "description": "La página principal tarda más de 10 segundos en cargar completamente. Esto afecta la experiencia del usuario.",
  "created_by": 3
}
```

### Bug 3 - Error de Validación
```json
{
  "title": "Validación de email incorrecta",
  "description": "El sistema acepta emails con formato inválido como 'test@' o 'test.com' sin el símbolo @.",
  "created_by": 2
}
```

## Estados de bugs válidos

- `open` - Bug reportado, pendiente de revisión
- `in_progress` - Bug siendo trabajado por el equipo
- `resolved` - Bug solucionado, pendiente de verificación
- `closed` - Bug cerrado y verificado

## Comandos curl para pruebas

### 1. Crear usuarios
```bash
# Crear admin
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@bughunt.com",
    "password": "admin123",
    "role": "admin"
  }'

# Crear desarrollador
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "developer"
  }'

# Crear tester
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "email": "maria@example.com",
    "password": "password123",
    "role": "tester"
  }'
```

### 2. Crear bugs
```bash
# Bug 1
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Error en formulario de login",
    "description": "El botón de login no responde cuando se hace clic en dispositivos móviles.",
    "created_by": 2
  }'

# Bug 2
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Carga lenta en página principal",
    "description": "La página principal tarda más de 10 segundos en cargar completamente.",
    "created_by": 3
  }'
```

### 3. Actualizar estado de bug
```bash
# Cambiar a "in_progress"
curl -X PATCH http://localhost:3000/api/bugs/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# Cambiar a "resolved"
curl -X PATCH http://localhost:3000/api/bugs/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'
```

### 4. Subir screenshot
```bash
# Nota: Necesitas tener un archivo de imagen en tu sistema
curl -X POST http://localhost:3000/api/bugs/upload \
  -F "screenshot=@/path/to/your/image.jpg" \
  -F "bug_id=1"
```

### 5. Consultar datos
```bash
# Listar usuarios
curl http://localhost:3000/api/users

# Listar bugs con screenshots
curl http://localhost:3000/api/bugs

# Obtener bug específico
curl http://localhost:3000/api/bugs/1
```

## Respuestas esperadas

### Usuario creado exitosamente
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "developer",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Bug con screenshots
```json
{
  "success": true,
  "message": "Bugs obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "title": "Error en formulario de login",
      "description": "El botón de login no responde...",
      "status": "open",
      "created_at": "2024-01-15T10:30:00.000Z",
      "creator_name": "Juan Pérez",
      "creator_email": "juan@example.com",
      "screenshots": [
        {
          "id": 1,
          "url": "https://res.cloudinary.com/...",
          "created_at": "2024-01-15T10:35:00.000Z"
        }
      ]
    }
  ]
}
```
