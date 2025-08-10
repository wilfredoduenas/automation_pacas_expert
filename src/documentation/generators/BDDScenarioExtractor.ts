import { TestScenario } from '../models/TestScenario';
import { IScenarioExtractor, ITestScenario } from '../interfaces/IDocumentationGenerator';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Extractor especializado para escenarios BDD de archivos TypeScript/Playwright.
 * Implementa el principio de responsabilidad única (SRP) de SOLID.
 */
export class BDDScenarioExtractor implements IScenarioExtractor {
  
  /**
   * Extrae escenarios BDD de un archivo de test.
   * @param filePath Ruta del archivo de test
   * @returns Array de escenarios encontrados
   */
  public async extractScenarios(filePath: string): Promise<ITestScenario[]> {
    if (!this.canProcess(filePath)) {
      throw new Error(`Cannot process file: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const scenarios: ITestScenario[] = [];
    
    const testType = this.determineTestType(filePath);
    const feature = this.extractFeature(content, filePath);
    
    let currentTest: Partial<ITestScenario> | null = null;
    let currentSteps: { given: string[], when: string[], then: string[] } = {
      given: [],
      when: [],
      then: []
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;
      
      // Detectar inicio de test
      if (this.isTestDeclaration(line)) {
        // Guardar test anterior si existe
        if (currentTest) {
          scenarios.push(this.createTestScenario(currentTest, currentSteps, filePath, testType));
        }
        
        // Inicializar nuevo test
        currentTest = {
          testName: this.extractTestName(line),
          description: this.extractTestDescription(line),
          lineNumber: lineNumber
        };
        currentSteps = { given: [], when: [], then: [] };
      }
      
      // Extraer pasos BDD de comentarios
      if (currentTest) {
        this.extractBDDSteps(line, currentSteps);
      }
    }
    
    // Procesar último test
    if (currentTest) {
      scenarios.push(this.createTestScenario(currentTest, currentSteps, filePath, testType));
    }
    
    // Devolver TODOS los scenarios, no solo los completos
    // Los incompletos se marcarán como tal en la documentación
    return scenarios;
  }

  /**
   * Verifica si el extractor puede procesar el archivo.
   * @param filePath Ruta del archivo
   * @returns true si puede procesar el archivo
   */
  public canProcess(filePath: string): boolean {
    return filePath.endsWith('.spec.ts') || filePath.endsWith('.test.ts');
  }

  /**
   * Determina el tipo de test basado en la ruta del archivo.
   * @param filePath Ruta del archivo
   * @returns Tipo de test
   */
  private determineTestType(filePath: string): 'validation' | 'rules' | 'e2e' {
    if (filePath.includes('/validation/') || filePath.includes('\\validation\\')) {
      return 'validation';
    }
    if (filePath.includes('/rules/') || filePath.includes('\\rules\\')) {
      return 'rules';
    }
    if (filePath.includes('/e2e/') || filePath.includes('\\e2e\\')) {
      return 'e2e';
    }
    return 'validation'; // default
  }

  /**
   * Extrae el feature del archivo basado en el describe.
   * @param content Contenido del archivo
   * @param filePath Ruta del archivo
   * @returns Nombre del feature
   */
  private extractFeature(content: string, filePath: string): string {
    const describeMatch = content.match(/test\.describe(?:\.parallel)?\(["'`]([^"'`]+)["'`]/);
    if (describeMatch) {
      return describeMatch[1];
    }
    
    // Fallback: usar nombre del archivo
    return path.basename(filePath, path.extname(filePath))
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Verifica si una línea es una declaración de test.
   * @param line Línea a verificar
   * @returns true si es una declaración de test
   */
  private isTestDeclaration(line: string): boolean {
    return /^\s*test\s*\(\s*["'`]/.test(line);
  }

  /**
   * Extrae el nombre del test de la declaración.
   * @param line Línea con la declaración del test
   * @returns Nombre del test
   */
  private extractTestName(line: string): string {
    const match = line.match(/test\s*\(\s*["'`]([^"'`]+)["'`]/);
    return match ? match[1] : 'Test sin nombre';
  }

  /**
   * Extrae la descripción del test (mismo que el nombre por ahora).
   * @param line Línea con la declaración del test
   * @returns Descripción del test
   */
  private extractTestDescription(line: string): string {
    return this.extractTestName(line);
  }

  /**
   * Extrae pasos BDD de una línea de comentario.
   * @param line Línea a procesar
   * @param steps Objeto donde almacenar los pasos
   */
  private extractBDDSteps(line: string, steps: { given: string[], when: string[], then: string[] }): void {
    // Buscar comentarios con pasos BDD
    if (line.includes('* Dado que') || line.includes('* Given')) {
      const step = this.cleanCommentText(line);
      if (step) steps.given.push(step);
    } else if (line.includes('* Cuando') || line.includes('* When')) {
      const step = this.cleanCommentText(line);
      if (step) steps.when.push(step);
    } else if (line.includes('* Entonces') || line.includes('* Then')) {
      const step = this.cleanCommentText(line);
      if (step) steps.then.push(step);
    }
    
    // También buscar en comentarios de línea simple
    if (line.startsWith('//')) {
      if (line.includes('Dado que') || line.includes('Given')) {
        const step = line.replace(/^\/\/\s*/, '').trim();
        if (step) steps.given.push(step);
      } else if (line.includes('Cuando') || line.includes('When')) {
        const step = line.replace(/^\/\/\s*/, '').trim();
        if (step) steps.when.push(step);
      } else if (line.includes('Entonces') || line.includes('Then')) {
        const step = line.replace(/^\/\/\s*/, '').trim();
        if (step) steps.then.push(step);
      }
    }
  }

  /**
   * Limpia el texto de comentarios JSDoc.
   * @param line Línea de comentario
   * @returns Texto limpio
   */
  private cleanCommentText(line: string): string {
    return line
      .replace(/^\s*\*+\s*/, '') // Remover asteriscos del inicio
      .replace(/(Dado que|Given|Cuando|When|Entonces|Then)\s*/, '') // Remover palabras clave BDD
      .trim();
  }

  /**
   * Crea un TestScenario completo.
   * @param testData Datos parciales del test
   * @param steps Pasos BDD extraídos
   * @param filePath Ruta del archivo
   * @param testType Tipo de test
   * @returns TestScenario completo
   */
  private createTestScenario(
    testData: Partial<ITestScenario>,
    steps: { given: string[], when: string[], then: string[] },
    filePath: string,
    testType: 'validation' | 'rules' | 'e2e'
  ): ITestScenario {
    const testName = testData.testName || 'Test sin nombre';
    
    // Si no hay pasos BDD, crear pasos básicos basados en el nombre del test
    const finalSteps = this.ensureMinimumSteps(steps, testName, testType);
    
    return new TestScenario(
      testName,
      testData.description || testName,
      this.extractFeature(fs.readFileSync(filePath, 'utf-8'), filePath),
      testName,
      finalSteps.given,
      finalSteps.when,
      finalSteps.then,
      filePath,
      testData.lineNumber || 0,
      testType,
      [],
      { 
        hasExplicitBDD: steps.given.length > 0 || steps.when.length > 0 || steps.then.length > 0,
        generatedSteps: finalSteps.generated || false
      }
    );
  }

  /**
   * Asegura que el test tenga pasos mínimos para ser considerado válido.
   * @param steps Pasos existentes
   * @param testName Nombre del test
   * @param testType Tipo de test
   * @returns Pasos con mínimos garantizados
   */
  private ensureMinimumSteps(
    steps: { given: string[], when: string[], then: string[] },
    testName: string,
    testType: 'validation' | 'rules' | 'e2e'
  ): { given: string[], when: string[], then: string[], generated?: boolean } {
    // Si ya tiene pasos BDD explícitos, devolverlos tal como están
    if (steps.given.length > 0 || steps.when.length > 0 || steps.then.length > 0) {
      return steps;
    }
    
    // Generar pasos básicos basados en el tipo de test y nombre
    const generatedSteps = this.generateBasicSteps(testName, testType);
    
    return {
      given: generatedSteps.given,
      when: generatedSteps.when,
      then: generatedSteps.then,
      generated: true
    };
  }

  /**
   * Genera pasos BDD básicos cuando no hay comentarios explícitos.
   * @param testName Nombre del test
   * @param testType Tipo de test
   * @returns Pasos BDD básicos generados
   */
  private generateBasicSteps(
    testName: string, 
    testType: 'validation' | 'rules' | 'e2e'
  ): { given: string[], when: string[], then: string[] } {
    const lowerName = testName.toLowerCase();
    
    if (testType === 'validation') {
      return {
        given: ['el usuario está en la aplicación'],
        when: ['navega a la página correspondiente'],
        then: ['debe ver todos los elementos de la interfaz correctamente']
      };
    }
    
    if (testType === 'rules') {
      if (lowerName.includes('login') || lowerName.includes('sesión')) {
        return {
          given: ['el usuario está en la página de login'],
          when: ['interactúa con los elementos de login'],
          then: ['debe cumplirse la regla de negocio especificada']
        };
      }
      
      if (lowerName.includes('register') || lowerName.includes('registro')) {
        return {
          given: ['el usuario está en la página de registro'],
          when: ['interactúa con los elementos de registro'],
          then: ['debe cumplirse la regla de negocio especificada']
        };
      }
      
      return {
        given: ['el usuario está en la aplicación'],
        when: ['ejecuta la acción correspondiente'],
        then: ['debe cumplirse la regla de negocio especificada']
      };
    }
    
    // e2e
    return {
      given: ['el usuario inicia el flujo end-to-end'],
      when: ['ejecuta las acciones del flujo completo'],
      then: ['debe completar el flujo exitosamente']
    };
  }
}
