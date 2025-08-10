import { IScenarioExtractor, ITestScenario } from '../interfaces/IDocumentationGenerator';
import { BDDScenarioExtractor } from '../generators/BDDScenarioExtractor';
import { CodeAnalysisExtractor } from './CodeAnalysisExtractor';
import * as fs from 'fs';

/**
 * Extractor híbrido que combina análisis de comentarios BDD con análisis de código.
 * Prioriza el análisis de código para generar escenarios más dinámicos y precisos.
 */
export class HybridScenarioExtractor implements IScenarioExtractor {
  private bddExtractor: BDDScenarioExtractor;
  private codeAnalysisExtractor: CodeAnalysisExtractor;

  constructor() {
    this.bddExtractor = new BDDScenarioExtractor();
    this.codeAnalysisExtractor = new CodeAnalysisExtractor();
  }

  /**
   * Extrae escenarios priorizando el análisis de código
   */
  async extractScenarios(filePath: string): Promise<ITestScenario[]> {
    try {
      const sourceCode = fs.readFileSync(filePath, 'utf-8');
      
      // Primero intentar análisis de código
      const codeScenarios = this.codeAnalysisExtractor.extractScenariosFromCode(filePath, sourceCode);
      
      if (codeScenarios.length > 0) {
        console.log(`🔍 Análisis de código: ${codeScenarios.length} escenarios extraídos de ${filePath.split('/').pop()}`);
        return codeScenarios;
      }
      
      // Fallback al extractor BDD tradicional
      console.log(`📄 Fallback BDD: analizando comentarios en ${filePath.split('/').pop()}`);
      return await this.bddExtractor.extractScenarios(filePath);
      
    } catch (error) {
      console.warn(`⚠️ Error extrayendo escenarios de ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Verifica si puede procesar el archivo
   */
  canProcess(filePath: string): boolean {
    return this.bddExtractor.canProcess(filePath);
  }
}
