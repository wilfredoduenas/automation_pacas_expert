#!/usr/bin/env node

/**
 * Script de inicio para el Test Runner
 * Ejecuta el servidor sin dependencias externas
 */

import { SimpleTestRunnerServer } from './server.js';
import * as path from 'path';

// Obtener argumentos de línea de comandos
const args = process.argv.slice(2);
const workspacePath = args[0] || process.cwd();
const port = parseInt(args[1]) || 3000;

// Validar que el workspace existe
import * as fs from 'fs';
if (!fs.existsSync(workspacePath)) {
  console.error(`Error: Workspace path does not exist: ${workspacePath}`);
  process.exit(1);
}

console.log('🚀 Starting Test Runner Server...');
console.log(`📁 Workspace: ${workspacePath}`);
console.log(`🌐 Port: ${port}`);
console.log('');

// Crear e iniciar el servidor
const server = new SimpleTestRunnerServer(workspacePath);

// Manejar errores del servidor
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down Test Runner Server...');
  server.stop();
  console.log('✅ Server stopped gracefully');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Iniciar el servidor
try {
  server.start(port);
  console.log('✅ Test Runner Server started successfully!');
  console.log(`🌐 Open your browser at: http://localhost:${port}`);
  console.log('📊 View test groups and execute tests from the web interface');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}
