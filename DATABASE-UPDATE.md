# 🔄 Actualización de Base de Datos - BugHunt

## ⚠️ IMPORTANTE: Actualizar Base de Datos Existente

Si ya tienes las tablas creadas y el servidor está funcionando, necesitas ejecutar el script de actualización para agregar las columnas `updated_at` que faltan.

### Opción 1: Ejecutar script de actualización (Recomendado)
```bash
psql -U postgres -d bugtracker -f update-database.sql
```

### Opción 2: Ejecutar comandos manualmente
```sql
-- Conectar a la base de datos
\c bugtracker

-- Agregar columna updated_at a users
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Agregar columna updated_at a bugs  
ALTER TABLE bugs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bugs_updated_at 
    BEFORE UPDATE ON bugs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Opción 3: Recrear base de datos (Si no tienes datos importantes)
```bash
# Eliminar base de datos existente
dropdb -U postgres bugtracker

# Crear nueva base de datos
createdb -U postgres bugtracker

# Ejecutar script completo
psql -U postgres -d bugtracker -f database.sql
```

## ✅ Verificar que funciona

Después de actualizar la base de datos, reinicia el servidor y prueba:

```bash
# Reiniciar servidor
npm start

# Probar registro
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Probar login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Probar crear bug (usar token del login)
curl -X POST http://localhost:3000/api/bugs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"title":"Bug de prueba","description":"Descripción del bug"}'
```

## 🎉 ¡Sistema de Autenticación Completo!

El backend ahora incluye:

- ✅ **Registro público** de usuarios
- ✅ **Login/logout** con JWT
- ✅ **Middleware de autenticación** para proteger rutas
- ✅ **Sistema de roles** (user, developer, admin)
- ✅ **Gestión de perfil** de usuario
- ✅ **Cambio de contraseña**
- ✅ **Protección de endpoints** según roles
- ✅ **Tokens JWT** con expiración configurable

### Roles y Permisos:
- **user**: Puede crear bugs, ver sus propios bugs
- **developer**: Puede cambiar estado de bugs + permisos de user
- **admin**: Acceso completo + puede gestionar usuarios
