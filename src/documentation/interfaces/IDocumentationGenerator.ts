/**
 * Interface principal para generadores de documentación.
 * Respeta el principio de inversión de dependencias (DIP) de SOLID.
 */
export interface IDocumentationGenerator {
  /**
   * Genera documentación para un directorio específico de tests.
   * @param testDirectory Directorio de tests a documentar
   * @param outputPath Ruta donde generar la documentación
   * @returns Promise que se resuelve cuando la documentación está generada
   */
  generateDocumentation(testDirectory: string, outputPath: string): Promise<void>;

  /**
   * Configura el generador con opciones específicas.
   * @param config Configuración del generador
   */
  configure(config: DocumentationConfig): void;
}

/**
 * Interface para extractores de escenarios.
 * Permite diferentes implementaciones de extracción (BDD, comentarios, etc.)
 */
export interface IScenarioExtractor {
  /**
   * Extrae escenarios de un archivo de test.
   * @param filePath Ruta del archivo de test
   * @returns Array de escenarios encontrados
   */
  extractScenarios(filePath: string): Promise<ITestScenario[]>;

  /**
   * Verifica si el extractor puede procesar el archivo.
   * @param filePath Ruta del archivo
   * @returns true si puede procesar el archivo
   */
  canProcess(filePath: string): boolean;
}

/**
 * Interface para formateadores de documentación.
 * Permite generar diferentes formatos (Markdown, HTML, PDF, etc.)
 */
export interface IFormatter {
  /**
   * Formatea los escenarios en el formato específico.
   * @param scenarios Array de escenarios a formatear
   * @param metadata Metadatos adicionales
   * @returns Contenido formateado
   */
  format(scenarios: ITestScenario[], metadata?: DocumentationMetadata): Promise<string>;

  /**
   * Obtiene la extensión de archivo para este formato.
   * @returns Extensión del archivo (ej: '.md', '.html')
   */
  getFileExtension(): string;
}

/**
 * Configuración del generador de documentación.
 */
export interface DocumentationConfig {
  includeTimestamp: boolean;
  includeTestMetadata: boolean;
  includeCodeSnippets: boolean;
  templatePath?: string;
  outputFormat: 'markdown' | 'html' | 'both';
  customSections?: string[];
}

/**
 * Metadatos de la documentación.
 */
export interface DocumentationMetadata {
  projectName: string;
  version: string;
  generatedAt: Date;
  testSuiteStats: TestSuiteStats;
}

/**
 * Estadísticas de la suite de tests.
 */
export interface TestSuiteStats {
  totalTests: number;
  totalScenarios: number;
  testsByType: Record<string, number>;
}

/**
 * Interface de un escenario de test extraído.
 */
export interface ITestScenario {
  testName: string;
  description: string;
  feature: string;
  scenario: string;
  given: string[];
  when: string[];
  then: string[];
  filePath: string;
  lineNumber: number;
  testType: 'validation' | 'rules' | 'e2e';
  tags?: string[];
  metadata?: Record<string, any>;
  
  // Métodos de utilidad
  toGherkinFormat(): string;
  getSummary(): ScenarioSummary;
  isComplete(): boolean;
}

/**
 * Resumen de un escenario.
 */
export interface ScenarioSummary {
  testName: string;
  scenario: string;
  stepsCount: number;
  testType: 'validation' | 'rules' | 'e2e';
  filePath: string;
}
