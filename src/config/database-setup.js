import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, Client } = pkg;

// Función para crear la base de datos
export const createDatabase = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: 'postgres' // Conectar a la base de datos por defecto
  });

  try {
    await client.connect();
    console.log('🔗 Conectado a PostgreSQL');

    // Verificar si la base de datos existe
    const dbCheck = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [process.env.DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      // Crear la base de datos
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Base de datos '${process.env.DB_NAME}' creada exitosamente`);
    } else {
      console.log(`ℹ️  Base de datos '${process.env.DB_NAME}' ya existe`);
    }

    await client.end();
    return true;

  } catch (error) {
    console.error('❌ Error creando base de datos:', error.message);
    await client.end();
    return false;
  }
};

// Función para crear las tablas
export const createTables = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });

  try {
    const client = await pool.connect();
    console.log(`🔗 Conectado a la base de datos '${process.env.DB_NAME}'`);

    // Crear tabla de usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla users creada/verificada');

    // Crear tabla de bugs
    await client.query(`
      CREATE TABLE IF NOT EXISTS bugs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla bugs creada/verificada');

    // Crear tabla de screenshots
    await client.query(`
      CREATE TABLE IF NOT EXISTS bug_screenshots (
        id SERIAL PRIMARY KEY,
        bug_id INTEGER REFERENCES bugs(id) ON DELETE CASCADE,
        url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla bug_screenshots creada/verificada');

    // Crear índices para mejorar el rendimiento
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bugs_created_by ON bugs(created_by)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs(status)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bug_screenshots_bug_id ON bug_screenshots(bug_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    console.log('✅ Índices creados/verificados');

    // Crear función para actualizar updated_at automáticamente
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);
    console.log('✅ Función update_updated_at_column creada/actualizada');

    // Crear triggers para actualizar updated_at automáticamente
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS update_bugs_updated_at ON bugs;
      CREATE TRIGGER update_bugs_updated_at 
          BEFORE UPDATE ON bugs 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);
    console.log('✅ Triggers creados/actualizados');

    client.release();
    await pool.end();
    
    console.log('🎉 Base de datos y tablas configuradas exitosamente');
    return true;

  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
    await pool.end();
    return false;
  }
};

// Función para verificar la conexión
export const testConnection = async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
    await pool.end();
    return false;
  }
};

// Función principal para inicializar todo
export const initializeDatabase = async () => {
  console.log('🚀 Inicializando base de datos BugHunt...');
  
  // Paso 1: Crear base de datos
  const dbCreated = await createDatabase();
  if (!dbCreated) {
    console.error('❌ No se pudo crear la base de datos');
    return false;
  }

  // Paso 2: Crear tablas
  const tablesCreated = await createTables();
  if (!tablesCreated) {
    console.error('❌ No se pudieron crear las tablas');
    return false;
  }

  // Paso 3: Verificar conexión
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ No se pudo verificar la conexión');
    return false;
  }

  console.log('🎉 Base de datos BugHunt inicializada completamente');
  return true;
};

export default { createDatabase, createTables, testConnection, initializeDatabase };
