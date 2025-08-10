#!/usr/bin/env node

import { TestDocumentationGenerator } from '../src/documentation/generators/TestDocumentationGenerator';
import { DocumentationConfig } from '../src/documentation/models/TestScenario';
import * as path from 'path';

/**
 * Script ejecutable para generar documentación de tests.
 * Uso: npm run generate-docs [directorio] [salida]
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Configuración por defecto
  const testDirectory = args[0] || path.join(process.cwd(), 'tests');
  const outputDirectory = args[1] || path.join(process.cwd(), 'docs', 'test-scenarios');
  
  console.log('🚀 Iniciando generación de documentación de tests...\n');
  console.log(`📂 Directorio de tests: ${testDirectory}`);
  console.log(`📄 Directorio de salida: ${outputDirectory}\n`);
  
  try {
    // Crear configuración
    const config = DocumentationConfig.createComplete();
    
    // Crear generador
    const generator = new TestDocumentationGenerator();
    generator.configure(config);
    
    // Generar documentación completa
    await generator.generateCompleteDocumentation(testDirectory, outputDirectory);
    
    console.log('\n✅ Documentación generada exitosamente!');
    console.log('\n📚 Archivos generados:');
    console.log(`├── ${outputDirectory}/validation-scenarios.md`);
    console.log(`├── ${outputDirectory}/rules-scenarios.md`);
    console.log(`├── ${outputDirectory}/e2e-scenarios.md`);
    console.log(`└── ${outputDirectory}/all-scenarios.md`);
    
    console.log('\n💡 Tip: Abre los archivos .md con cualquier editor de Markdown para una mejor visualización.');
    
  } catch (error) {
    console.error('\n❌ Error generando documentación:', error);
    process.exit(1);
  }
}

// Ejecutar directamente
main().catch(console.error);
