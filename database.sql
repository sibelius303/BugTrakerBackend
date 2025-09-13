-- Script SQL para crear las tablas de BugHunt
-- Ejecutar este script en PostgreSQL después de crear la base de datos 'bugtracker'

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de bugs
CREATE TABLE bugs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de screenshots de bugs
CREATE TABLE bug_screenshots (
    id SERIAL PRIMARY KEY,
    bug_id INTEGER REFERENCES bugs(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_bugs_created_by ON bugs(created_by);
CREATE INDEX idx_bugs_status ON bugs(status);
CREATE INDEX idx_bug_screenshots_bug_id ON bug_screenshots(bug_id);
CREATE INDEX idx_users_email ON users(email);
