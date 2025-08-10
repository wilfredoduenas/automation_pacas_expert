import { TestDocumentationGenerator } from '../../src/documentation/generators/TestDocumentationGenerator';
import { BDDScenarioExtractor } from '../../src/documentation/generators/BDDScenarioExtractor';
import { MarkdownFormatter } from '../../src/documentation/generators/MarkdownFormatter';
import { DocumentationConfig } from '../../src/documentation/models/TestScenario';
import { test, expect } from '@playwright/test';

/**
 * Test de demostración del generador de documentación.
 * Muestra cómo usar el sistema sin afectar los tests reales.
 */
test.describe('Documentation Generator Demo', () => {
  test('Demostrar generación de documentación', async () => {
    // Configurar generador
    const extractor = new BDDScenarioExtractor();
    const formatter = new MarkdownFormatter();
    const config = DocumentationConfig.createDefault();
    
    const generator = new TestDocumentationGenerator(extractor, formatter, config);
    
    // Este test no afecta otros tests, solo demuestra el uso
    expect(generator).toBeDefined();
    expect(extractor.canProcess('test.spec.ts')).toBe(true);
    expect(formatter.getFileExtension()).toBe('.md');
    
    console.log('✅ Test Documentation Generator está listo para usar');
    console.log('💡 Ejecuta: npm run generate-docs para generar documentación');
  });
});
