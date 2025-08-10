import { TestScenario, DocumentationConfig } from '../models/TestScenario';
import { 
  IDocumentationGenerator, 
  IScenarioExtractor, 
  IFormatter, 
  DocumentationMetadata,
  TestSuiteStats,
  ITestScenario
} from '../interfaces/IDocumentationGenerator';
import { BDDScenarioExtractor } from './BDDScenarioExtractor';
import { MarkdownFormatter } from './MarkdownFormatter';
import { FileScanner } from '../utils/FileScanner';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generador principal de documentación de tests.
 * Implementa el patrón Strategy para extractores y formateadores.
 * Respeta todos los principios SOLID.
 */
export class TestDocumentationGenerator implements IDocumentationGenerator {
  private extractor: IScenarioExtractor;
  private formatter: IFormatter;
  private config: DocumentationConfig;
  private fileScanner: FileScanner;

  constructor(
    extractor?: IScenarioExtractor,
    formatter?: IFormatter,
    config?: DocumentationConfig
  ) {
    // Dependency Injection con valores por defecto
    this.extractor = extractor || new BDDScenarioExtractor();
    this.formatter = formatter || new MarkdownFormatter();
    this.config = config || DocumentationConfig.createDefault();
    this.fileScanner = new FileScanner();
  }

  /**
   * Configura el generador con opciones específicas.
   * @param config Configuración del generador
   */
  public configure(config: DocumentationConfig): void {
    this.config = config;
  }

  /**
   * Cambia el extractor de escenarios (Strategy Pattern).
   * @param extractor Nuevo extractor a utilizar
   */
  public setExtractor(extractor: IScenarioExtractor): void {
    this.extractor = extractor;
  }

  /**
   * Cambia el formateador (Strategy Pattern).
   * @param formatter Nuevo formateador a utilizar
   */
  public setFormatter(formatter: IFormatter): void {
    this.formatter = formatter;
  }

  /**
   * Genera documentación para un directorio específico de tests.
   * @param testDirectory Directorio de tests a documentar
   * @param outputPath Ruta donde generar la documentación
   */
  public async generateDocumentation(testDirectory: string, outputPath: string): Promise<void> {
    try {
      console.log(`🔍 Escaneando directorio: ${testDirectory}`);
      
      // Escanear archivos de test
      const testFiles = await this.fileScanner.scanTestFiles(testDirectory);
      
      if (testFiles.length === 0) {
        console.warn(`⚠️ No se encontraron archivos de test en: ${testDirectory}`);
        return;
      }

      console.log(`📁 Encontrados ${testFiles.length} archivos de test`);
      
      // Extraer escenarios de todos los archivos
      const allScenarios: ITestScenario[] = [];
      
      for (const testFile of testFiles) {
        if (this.extractor.canProcess(testFile)) {
          console.log(`📖 Procesando: ${path.basename(testFile)}`);
          const scenarios = await this.extractor.extractScenarios(testFile);
          allScenarios.push(...scenarios);
        }
      }

      console.log(`✨ Extraídos ${allScenarios.length} escenarios`);
      
      // Generar metadatos
      const metadata = this.generateMetadata(allScenarios, testDirectory);
      
      // Formatear documentación
      const documentation = await this.formatter.format(allScenarios, metadata);
      
      // Escribir archivo de salida
      await this.writeDocumentation(documentation, outputPath);
      
      // Generar reporte de estadísticas
      this.printGenerationStats(allScenarios, metadata);
      
    } catch (error) {
      console.error('❌ Error generando documentación:', error);
      throw error;
    }
  }

  /**
   * Genera documentación para todos los tipos de test.
   * @param baseTestDirectory Directorio base que contiene validation, rules, e2e
   * @param outputDirectory Directorio donde generar las documentaciones
   */
  public async generateCompleteDocumentation(
    baseTestDirectory: string, 
    outputDirectory: string
  ): Promise<void> {
    const testTypes = ['validation', 'rules', 'e2e'];
    
    // Generar documentación por tipo
    for (const testType of testTypes) {
      const testDir = path.join(baseTestDirectory, testType);
      
      if (fs.existsSync(testDir)) {
        const outputFile = path.join(outputDirectory, `${testType}-scenarios`);
        await this.generateDocumentation(testDir, outputFile);
      }
    }
    
    // Generar documentación general
    const generalOutputFile = path.join(outputDirectory, 'all-scenarios');
    await this.generateDocumentation(baseTestDirectory, generalOutputFile);
  }

  /**
   * Genera metadatos para la documentación.
   * @param scenarios Array de escenarios extraídos
   * @param testDirectory Directorio de tests
   * @returns Metadatos de la documentación
   */
  private generateMetadata(scenarios: ITestScenario[], testDirectory: string): DocumentationMetadata {
    const stats = this.calculateTestSuiteStats(scenarios);
    
    return {
      projectName: this.getProjectName(testDirectory),
      version: this.getProjectVersion(),
      generatedAt: new Date(),
      testSuiteStats: stats
    };
  }

  /**
   * Calcula estadísticas de la suite de tests.
   * @param scenarios Array de escenarios
   * @returns Estadísticas calculadas
   */
  private calculateTestSuiteStats(scenarios: ITestScenario[]): TestSuiteStats {
    const testsByType = scenarios.reduce((acc, scenario) => {
      acc[scenario.testType] = (acc[scenario.testType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTests: scenarios.length,
      totalScenarios: scenarios.filter(s => s.isComplete()).length,
      testsByType
    };
  }

  /**
   * Obtiene el nombre del proyecto.
   * @param testDirectory Directorio de tests
   * @returns Nombre del proyecto
   */
  private getProjectName(testDirectory: string): string {
    try {
      const packageJsonPath = this.findPackageJson(testDirectory);
      if (packageJsonPath) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.name || 'Proyecto de Automatización';
      }
    } catch (error) {
      console.warn('No se pudo leer package.json');
    }
    
    return 'Proyecto de Automatización';
  }

  /**
   * Obtiene la versión del proyecto.
   * @returns Versión del proyecto
   */
  private getProjectVersion(): string {
    try {
      const packageJsonPath = this.findPackageJson(process.cwd());
      if (packageJsonPath) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        return packageJson.version || '1.0.0';
      }
    } catch (error) {
      console.warn('No se pudo leer la versión del package.json');
    }
    
    return '1.0.0';
  }

  /**
   * Busca el archivo package.json en el directorio o directorios padre.
   * @param startDir Directorio donde comenzar la búsqueda
   * @returns Ruta del package.json o null si no se encuentra
   */
  private findPackageJson(startDir: string): string | null {
    let currentDir = startDir;
    
    while (currentDir !== path.dirname(currentDir)) {
      const packageJsonPath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        return packageJsonPath;
      }
      currentDir = path.dirname(currentDir);
    }
    
    return null;
  }

  /**
   * Escribe la documentación en el archivo de salida.
   * @param documentation Contenido de la documentación
   * @param outputPath Ruta base del archivo de salida (sin extensión)
   */
  private async writeDocumentation(documentation: string, outputPath: string): Promise<void> {
    const extension = this.formatter.getFileExtension();
    const fullOutputPath = `${outputPath}${extension}`;
    
    // Crear directorio de salida si no existe
    const outputDir = path.dirname(fullOutputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Escribir archivo
    fs.writeFileSync(fullOutputPath, documentation, 'utf-8');
    
    console.log(`📄 Documentación generada: ${fullOutputPath}`);
  }

  /**
   * Imprime estadísticas de la generación.
   * @param scenarios Array de escenarios
   * @param metadata Metadatos
   */
  private printGenerationStats(scenarios: ITestScenario[], metadata: DocumentationMetadata): void {
    console.log('\n📊 Estadísticas de Generación:');
    console.log(`├── Total de scenarios: ${scenarios.length}`);
    console.log(`├── Scenarios completos: ${scenarios.filter(s => s.isComplete()).length}`);
    console.log(`├── Por tipo:`);
    
    Object.entries(metadata.testSuiteStats.testsByType).forEach(([type, count]) => {
      console.log(`│   ├── ${type}: ${count}`);
    });
    
    console.log(`└── Generado: ${metadata.generatedAt.toLocaleString()}`);
  }
}
