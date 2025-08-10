import { ITestDiscovery, TestType, TestChangeEvent } from '../interfaces/ITestDiscovery';
import { TestGroup, TestFile, TestCase } from '../models/TestModels';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Implementación concreta para descubrimiento de tests
 * Principio: Single Responsibility - Solo descubre tests
 * Principio: Open/Closed - Extensible para nuevos tipos de tests
 */
export class PlaywrightTestDiscovery implements ITestDiscovery {
  private testGroups: TestGroup[] = [];
  private watchCallbacks: Array<(changes: TestChangeEvent) => void> = [];

  constructor(private workspacePath: string) {}

  async discoverTests(): Promise<TestGroup[]> {
    const testGroups: TestGroup[] = [];

    // Descubrir tests por tipo
    const e2eTests = await this.discoverTestsByPattern('tests/e2e/**/*.spec.ts', 'e2e', 'E2E Tests', 'integration_instructions');
    const rulesTests = await this.discoverTestsByPattern('tests/rules/**/*.spec.ts', 'rules', 'Rules Tests', 'rule');
    const validationTests = await this.discoverTestsByPattern('tests/validation/**/*.spec.ts', 'validation', 'Validation Tests', 'verified_user');

    if (e2eTests.files.length > 0) testGroups.push(e2eTests);
    if (rulesTests.files.length > 0) testGroups.push(rulesTests);
    if (validationTests.files.length > 0) testGroups.push(validationTests);

    this.testGroups = testGroups;
    return testGroups;
  }

  async discoverTestsByType(type: TestType): Promise<TestFile[]> {
    const pattern = `tests/${type}/**/*.spec.ts`;
    const group = await this.discoverTestsByPattern(pattern, type, `${type} Tests`, 'code');
    return group.files;
  }

  async discoverTestsByFile(filename: string): Promise<TestCase[]> {
    const fullPath = path.join(this.workspacePath, filename);
    
    if (!fs.existsSync(fullPath)) {
      return [];
    }

    const content = await fs.promises.readFile(fullPath, 'utf-8');
    return this.parseTestCases(content, filename);
  }

  async watchForChanges(callback: (changes: TestChangeEvent) => void): Promise<void> {
    this.watchCallbacks.push(callback);

    // Configurar file watcher para detectar cambios
    const testPatterns = [
      'tests/e2e/**/*.spec.ts',
      'tests/rules/**/*.spec.ts',
      'tests/validation/**/*.spec.ts'
    ];

    for (const pattern of testPatterns) {
      const files = await this.findFiles(pattern);
      
      for (const file of files) {
        const fullPath = path.join(this.workspacePath, file);
        
        fs.watchFile(fullPath, { interval: 1000 }, async () => {
          const updatedGroups = await this.discoverTests();
          this.notifyWatchers({
            action: 'modified',
            filePath: fullPath,
            testGroups: updatedGroups
          });
        });
      }
    }
  }

  getTestGroups(): TestGroup[] {
    return this.testGroups;
  }

  async refreshTests(): Promise<TestGroup[]> {
    return await this.discoverTests();
  }

  private async findFiles(pattern: string): Promise<string[]> {
    const testDir = path.join(this.workspacePath, 'tests');
    const files: string[] = [];
    
    const walkDir = (dir: string, subPath: string = '') => {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const relativePath = path.join(subPath, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
          walkDir(fullPath, relativePath);
        } else if (item.endsWith('.spec.ts')) {
          files.push(path.join('tests', relativePath).replace(/\\/g, '/'));
        }
      }
    };
    
    walkDir(testDir);
    return files;
  }

  private async discoverTestsByPattern(
    pattern: string, 
    type: TestType, 
    displayName: string, 
    icon: string
  ): Promise<TestGroup> {
    const files = await this.findFiles(pattern);
    const testFiles: TestFile[] = [];
    let totalTests = 0;

    for (const file of files) {
      const fullPath = path.join(this.workspacePath, file);
      const stats = await fs.promises.stat(fullPath);
      const testCases = await this.parseTestCases(
        await fs.promises.readFile(fullPath, 'utf-8'),
        file
      );

      testFiles.push({
        filename: path.basename(file),
        path: fullPath,
        tests: testCases,
        lastModified: stats.mtime,
        size: stats.size
      });

      totalTests += testCases.length;
    }

    return {
      type,
      displayName,
      icon,
      files: testFiles,
      totalTests,
      statistics: {
        total: totalTests,
        passed: 0,
        failed: 0,
        skipped: 0,
        running: 0,
        idle: totalTests
      }
    };
  }

  private parseTestCases(content: string, filename: string): TestCase[] {
    const testCases: TestCase[] = [];
    const testRegex = /test\(['"`]([^'"`]+)['"`]/g;
    let match;

    while ((match = testRegex.exec(content)) !== null) {
      const testName = match[1];
      const testId = `${filename}::${testName}`;

      testCases.push({
        id: testId,
        name: testName,
        status: {
          status: 'idle'
        },
        tags: this.extractTags(content, match.index)
      });
    }

    return testCases;
  }

  private extractTags(content: string, testIndex: number): string[] {
    // Buscar comentarios antes del test para extraer tags
    const beforeTest = content.substring(0, testIndex);
    const lines = beforeTest.split('\n');
    const tags: string[] = [];

    // Buscar en las últimas 5 líneas antes del test
    for (let i = Math.max(0, lines.length - 5); i < lines.length; i++) {
      const line = lines[i];
      const tagMatch = line.match(/@(\w+)/g);
      if (tagMatch) {
        tags.push(...tagMatch.map(tag => tag.substring(1)));
      }
    }

    return tags;
  }

  private notifyWatchers(changes: TestChangeEvent): void {
    this.testGroups = changes.testGroups;
    this.watchCallbacks.forEach(callback => callback(changes));
  }
}
