import { DocumentationConfig } from '../models/TestScenario';
import { IFormatter, DocumentationMetadata, ITestScenario } from '../interfaces/IDocumentationGenerator';

/**
 * Formateador que genera documentación en formato Markdown.
 * Implementa el principio de responsabilidad única (SRP) y es fácilmente extensible.
 */
export class MarkdownFormatter implements IFormatter {

  /**
   * Formatea los escenarios en formato Markdown.
   * @param scenarios Array de escenarios a formatear
   * @param metadata Metadatos adicionales
   * @returns Contenido en formato Markdown
   */
  public async format(scenarios: ITestScenario[], metadata?: DocumentationMetadata): Promise<string> {
    const sections: string[] = [];
    
    // Header principal
    sections.push(this.generateHeader(metadata));
    
    // Tabla de contenidos
    sections.push(this.generateTableOfContents(scenarios));
    
    // Resumen ejecutivo
    sections.push(this.generateExecutiveSummary(scenarios, metadata));
    
    // Escenarios por tipo
    sections.push(this.generateScenariosByType(scenarios));
    
    // Lista detallada de escenarios
    sections.push(this.generateDetailedScenarios(scenarios));
    
    // Footer
    sections.push(this.generateFooter(metadata));
    
    return sections.join('\n\n');
  }

  /**
   * Obtiene la extensión de archivo para este formato.
   * @returns Extensión '.md'
   */
  public getFileExtension(): string {
    return '.md';
  }

  /**
   * Genera el header principal del documento.
   * @param metadata Metadatos del proyecto
   * @returns Header en Markdown
   */
  private generateHeader(metadata?: DocumentationMetadata): string {
    const projectName = metadata?.projectName || 'Proyecto de Automatización';
    const version = metadata?.version || '1.0.0';
    const date = metadata?.generatedAt || new Date();
    
    return `# 📋 Documentación de Tests - ${projectName}

**Versión:** ${version}  
**Generado:** ${date.toLocaleDateString('es-ES', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

---`;
  }

  /**
   * Genera la tabla de contenidos.
   * @param scenarios Array de escenarios
   * @returns Tabla de contenidos en Markdown
   */
  private generateTableOfContents(scenarios: ITestScenario[]): string {
    const types = this.groupScenariosByType(scenarios);
    const toc: string[] = ['## 📑 Tabla de Contenidos'];
    
    toc.push('- [Resumen Ejecutivo](#resumen-ejecutivo)');
    toc.push('- [Escenarios por Tipo](#escenarios-por-tipo)');
    
    Object.keys(types).forEach(type => {
      const typeTitle = this.getTypeTitle(type as any);
      const anchor = this.createAnchor(typeTitle);
      toc.push(`  - [${typeTitle}](#${anchor})`);
    });
    
    toc.push('- [Escenarios Detallados](#escenarios-detallados)');
    
    return toc.join('\n');
  }

  /**
   * Genera el resumen ejecutivo.
   * @param scenarios Array de escenarios
   * @param metadata Metadatos
   * @returns Resumen ejecutivo en Markdown
   */
  private generateExecutiveSummary(scenarios: ITestScenario[], metadata?: DocumentationMetadata): string {
    const types = this.groupScenariosByType(scenarios);
    const totalScenarios = scenarios.length;
    const completeScenarios = scenarios.filter(s => s.isComplete()).length;
    const explicitBDDScenarios = scenarios.filter(s => s.hasExplicitBDD()).length;
    const completionRate = totalScenarios > 0 ? Math.round((completeScenarios / totalScenarios) * 100) : 0;
    const bddRate = totalScenarios > 0 ? Math.round((explicitBDDScenarios / totalScenarios) * 100) : 0;
    
    const summary = [`## 📊 Resumen Ejecutivo`];
    
    summary.push(`| Métrica | Valor |`);
    summary.push(`|---------|--------|`);
    summary.push(`| **Total de Tests** | ${totalScenarios} |`);
    summary.push(`| **Escenarios Completos** | ${completeScenarios} |`);
    summary.push(`| **Tasa de Completitud** | ${completionRate}% |`);
    summary.push(`| **Tests con BDD Explícito** | ${explicitBDDScenarios} |`);
    summary.push(`| **Tasa de BDD Explícito** | ${bddRate}% |`);
    
    // Breakdown por tipo
    Object.entries(types).forEach(([type, typeScenarios]) => {
      const typeTitle = this.getTypeTitle(type as any);
      const explicitInType = typeScenarios.filter(s => s.hasExplicitBDD()).length;
      summary.push(`| **${typeTitle}** | ${typeScenarios.length} tests (${explicitInType} con BDD) |`);
    });
    
    // Leyenda
    summary.push('');
    summary.push('**Leyenda:**');
    summary.push('- ✅ Test mapeado completamente');
    summary.push('- ⚠️ Test incompleto o sin pasos BDD');
    summary.push('- 🔄 Pasos BDD generados automáticamente');
    
    return summary.join('\n');
  }

  /**
   * Genera la sección de escenarios agrupados por tipo.
   * @param scenarios Array de escenarios
   * @returns Sección agrupada en Markdown
   */
  private generateScenariosByType(scenarios: ITestScenario[]): string {
    const types = this.groupScenariosByType(scenarios);
    const sections: string[] = ['## 🗂️ Escenarios por Tipo'];
    
    Object.entries(types).forEach(([type, typeScenarios]) => {
      const typeTitle = this.getTypeTitle(type as any);
      const icon = this.getTypeIcon(type as any);
      
      sections.push(`### ${icon} ${typeTitle}`);
      sections.push(`**Total de tests:** ${typeScenarios.length}\n`);
      
      // Lista de tests
      typeScenarios.forEach(scenario => {
        const status = scenario.isComplete() ? '✅' : '⚠️';
        const bddStatus = scenario.hasExplicitBDD() ? '' : ' 🔄';
        const fileName = this.getFileName(scenario.filePath);
        sections.push(`- ${status}${bddStatus} **${scenario.testName}** (_${fileName}_)`);
      });
    });
    
    return sections.join('\n');
  }

  /**
   * Genera la lista detallada de escenarios en formato Gherkin.
   * @param scenarios Array de escenarios
   * @returns Lista detallada en Markdown
   */
  private generateDetailedScenarios(scenarios: ITestScenario[]): string {
    const sections: string[] = ['## 📝 Escenarios Detallados'];
    
    const types = this.groupScenariosByType(scenarios);
    
    Object.entries(types).forEach(([type, typeScenarios]) => {
      const typeTitle = this.getTypeTitle(type as any);
      const icon = this.getTypeIcon(type as any);
      
      sections.push(`### ${icon} ${typeTitle}`);
      
      typeScenarios.forEach((scenario, index) => {
        // Determinar el estado del escenario
        let statusIcon = '⚠️';
        let bddStatus = 'sin pasos BDD definidos';
        
        if (scenario.hasExplicitBDD()) {
          statusIcon = '✅';
          bddStatus = 'BDD explícito';
        } else if (scenario.hasGeneratedSteps()) {
          statusIcon = '🔄';
          bddStatus = 'pasos generados automáticamente';
        }
        
        sections.push(`#### ${index + 1}. ${statusIcon} ${scenario.testName}`);
        
        // Información del archivo y estado
        const fileName = this.getFileName(scenario.filePath);
        sections.push(`**Archivo:** \`${fileName}\` | **Línea:** ${scenario.lineNumber} | **Estado:** ${bddStatus}`);
        
        // Escenario en formato Gherkin
        if (scenario.hasExplicitBDD()) {
          sections.push('```gherkin');
          sections.push(scenario.toGherkinFormat());
          sections.push('```');
        } else if (scenario.hasGeneratedSteps()) {
          sections.push('```gherkin');
          sections.push('# Escenario generado automáticamente basado en el nombre del test');
          sections.push(scenario.toGherkinFormat());
          sections.push('```');
          sections.push('> 🔄 **Pasos generados automáticamente** - Considere agregar comentarios BDD explícitos para mejorar la documentación');
        } else {
          sections.push('> ⚠️ **Escenario sin pasos BDD** - Test mapeado pero sin pasos definidos');
        }
        
        sections.push('---');
      });
    });
    
    return sections.join('\n');
  }

  /**
   * Genera el footer del documento.
   * @param metadata Metadatos
   * @returns Footer en Markdown
   */
  private generateFooter(metadata?: DocumentationMetadata): string {
    return `---

## 🔧 Información Técnica

- **Framework:** Playwright + TypeScript
- **Patrón:** Page Object Model (POM)
- **Principios:** SOLID
- **Formato BDD:** Gherkin

> 📄 **Documentación generada automáticamente** por Test Documentation Generator  
> Para actualizar esta documentación, ejecute: \`npm run generate-docs\``;
  }

  /**
   * Agrupa escenarios por tipo.
   * @param scenarios Array de escenarios
   * @returns Escenarios agrupados por tipo
   */
  private groupScenariosByType(scenarios: ITestScenario[]): Record<string, ITestScenario[]> {
    return scenarios.reduce((groups, scenario) => {
      const type = scenario.testType;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(scenario);
      return groups;
    }, {} as Record<string, ITestScenario[]>);
  }

  /**
   * Obtiene el título formateado para un tipo de test.
   * @param type Tipo de test
   * @returns Título formateado
   */
  private getTypeTitle(type: 'validation' | 'rules' | 'e2e'): string {
    const titles = {
      validation: 'Tests de Validación',
      rules: 'Tests de Reglas de Negocio',
      e2e: 'Tests End-to-End'
    };
    return titles[type] || type;
  }

  /**
   * Obtiene el icono para un tipo de test.
   * @param type Tipo de test
   * @returns Icono emoji
   */
  private getTypeIcon(type: 'validation' | 'rules' | 'e2e'): string {
    const icons = {
      validation: '🔍',
      rules: '⚖️',
      e2e: '🔄'
    };
    return icons[type] || '📋';
  }

  /**
   * Extrae el nombre del archivo de una ruta.
   * @param filePath Ruta completa del archivo
   * @returns Nombre del archivo
   */
  private getFileName(filePath: string): string {
    return filePath.split(/[\\/]/).pop() || filePath;
  }

  /**
   * Crea un anchor para enlaces internos.
   * @param text Texto para el anchor
   * @returns Anchor formateado
   */
  private createAnchor(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
