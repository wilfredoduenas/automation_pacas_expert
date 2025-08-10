import { ITestScenario, ScenarioSummary as IScenarioSummary } from '../interfaces/IDocumentationGenerator';

/**
 * Modelo que representa un escenario de test extraído.
 * Encapsula toda la información necesaria para generar documentación.
 */
export class TestScenario implements ITestScenario {
  public readonly testName: string;
  public readonly description: string;
  public readonly feature: string;
  public readonly scenario: string;
  public readonly given: string[];
  public readonly when: string[];
  public readonly then: string[];
  public readonly filePath: string;
  public readonly lineNumber: number;
  public readonly testType: 'validation' | 'rules' | 'e2e';
  public readonly tags: string[];
  public readonly metadata: Record<string, any>;

  constructor(
    testName: string,
    description: string,
    feature: string,
    scenario: string,
    given: string[],
    when: string[],
    then: string[],
    filePath: string,
    lineNumber: number,
    testType: 'validation' | 'rules' | 'e2e',
    tags: string[] = [],
    metadata: Record<string, any> = {}
  ) {
    this.testName = testName;
    this.description = description;
    this.feature = feature;
    this.scenario = scenario;
    this.given = given;
    this.when = when;
    this.then = then;
    this.filePath = filePath;
    this.lineNumber = lineNumber;
    this.testType = testType;
    this.tags = tags;
    this.metadata = metadata;
  }

  /**
   * Convierte el escenario a formato Gherkin.
   * @returns String en formato Gherkin
   */
  public toGherkinFormat(): string {
    const lines: string[] = [];
    
    if (this.feature) {
      lines.push(`Feature: ${this.feature}`);
      lines.push('');
    }
    
    if (this.scenario) {
      lines.push(`  Scenario: ${this.scenario}`);
    }
    
    // Given: Solo el primero es Given, los demás son And
    this.given.forEach((step, index) => {
      const keyword = index === 0 ? 'Given' : 'And';
      lines.push(`    ${keyword} ${step}`);
    });
    
    // When: Solo el primero es When, los demás son And
    this.when.forEach((step, index) => {
      const keyword = index === 0 ? 'When' : 'And';
      lines.push(`    ${keyword} ${step}`);
    });
    
    // Then: Solo el primero es Then, los demás son And
    this.then.forEach((step, index) => {
      const keyword = index === 0 ? 'Then' : 'And';
      lines.push(`    ${keyword} ${step}`);
    });
    
    return lines.join('\n');
  }

  /**
   * Obtiene un resumen del escenario.
   * @returns Objeto con resumen del escenario
   */
  public getSummary(): IScenarioSummary {
    return {
      testName: this.testName,
      scenario: this.scenario,
      stepsCount: this.given.length + this.when.length + this.then.length,
      testType: this.testType,
      filePath: this.filePath
    };
  }

  /**
   * Verifica si el escenario tiene todos los pasos BDD requeridos.
   * @returns true si el escenario está completo
   */
  public isComplete(): boolean {
    // Un escenario está completo si tiene al menos un paso en cada categoría
    // Y tiene un nombre de escenario válido
    return this.given.length > 0 && 
           this.when.length > 0 && 
           this.then.length > 0 &&
           this.scenario.trim() !== '';
  }

  /**
   * Verifica si el escenario tiene comentarios BDD explícitos.
   * @returns true si tiene comentarios BDD explícitos
   */
  public hasExplicitBDD(): boolean {
    return this.metadata.hasExplicitBDD === true;
  }

  /**
   * Verifica si los pasos fueron generados automáticamente.
   * @returns true si los pasos fueron generados
   */
  public hasGeneratedSteps(): boolean {
    return this.metadata.generatedSteps === true;
  }
}

/**
 * Configuración para la generación de documentación.
 */
export class DocumentationConfig {
  public readonly includeTimestamp: boolean;
  public readonly includeTestMetadata: boolean;
  public readonly includeCodeSnippets: boolean;
  public readonly templatePath?: string;
  public readonly outputFormat: 'markdown' | 'html' | 'both';
  public readonly customSections: string[];

  constructor(
    includeTimestamp = true,
    includeTestMetadata = true,
    includeCodeSnippets = false,
    outputFormat: 'markdown' | 'html' | 'both' = 'markdown',
    templatePath?: string,
    customSections: string[] = []
  ) {
    this.includeTimestamp = includeTimestamp;
    this.includeTestMetadata = includeTestMetadata;
    this.includeCodeSnippets = includeCodeSnippets;
    this.outputFormat = outputFormat;
    this.templatePath = templatePath;
    this.customSections = customSections;
  }

  /**
   * Crea una configuración por defecto.
   * @returns Configuración con valores por defecto
   */
  public static createDefault(): DocumentationConfig {
    return new DocumentationConfig();
  }

  /**
   * Crea una configuración para documentación completa.
   * @returns Configuración con todas las opciones habilitadas
   */
  public static createComplete(): DocumentationConfig {
    return new DocumentationConfig(
      true,
      true,
      true,
      'both',
      undefined,
      ['Test Coverage', 'Performance Notes', 'Known Issues']
    );
  }
}

/**
 * Resumen de un escenario (para evitar conflictos con la interface).
 */
export interface TestScenarioSummary {
  testName: string;
  scenario: string;
  stepsCount: number;
  testType: 'validation' | 'rules' | 'e2e';
  filePath: string;
}
