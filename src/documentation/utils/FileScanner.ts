import * as fs from 'fs';
import * as path from 'path';

/**
 * Utilidad para escanear archivos de test en directorios.
 * Implementa el principio de responsabilidad única (SRP).
 */
export class FileScanner {
  
  /**
   * Escanea un directorio en busca de archivos de test.
   * @param directory Directorio a escanear
   * @param recursive Si debe escanear recursivamente (por defecto true)
   * @returns Array de rutas de archivos de test
   */
  public async scanTestFiles(directory: string, recursive: boolean = true): Promise<string[]> {
    if (!fs.existsSync(directory)) {
      throw new Error(`Directory does not exist: ${directory}`);
    }

    const testFiles: string[] = [];
    await this.scanDirectory(directory, testFiles, recursive);
    
    return testFiles.sort(); // Ordenar para consistencia
  }

  /**
   * Verifica si un archivo es un archivo de test.
   * @param filePath Ruta del archivo
   * @returns true si es un archivo de test
   */
  public isTestFile(filePath: string): boolean {
    const fileName = path.basename(filePath);
    return fileName.endsWith('.spec.ts') || 
           fileName.endsWith('.test.ts') ||
           fileName.endsWith('.spec.js') ||
           fileName.endsWith('.test.js');
  }

  /**
   * Obtiene información estadística de los archivos escaneados.
   * @param testFiles Array de archivos de test
   * @returns Estadísticas de los archivos
   */
  public getFileStats(testFiles: string[]): FileStats {
    const byExtension = testFiles.reduce((acc, file) => {
      const ext = path.extname(file);
      acc[ext] = (acc[ext] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byDirectory = testFiles.reduce((acc, file) => {
      const dir = path.dirname(file);
      const dirName = path.basename(dir);
      acc[dirName] = (acc[dirName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: testFiles.length,
      byExtension,
      byDirectory,
      averagePathLength: testFiles.reduce((acc, file) => acc + file.length, 0) / testFiles.length
    };
  }

  /**
   * Filtra archivos por patrón.
   * @param testFiles Array de archivos
   * @param pattern Patrón regex o string
   * @returns Archivos que coinciden con el patrón
   */
  public filterByPattern(testFiles: string[], pattern: string | RegExp): string[] {
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;
    return testFiles.filter(file => regex.test(file));
  }

  /**
   * Escanea un directorio recursivamente.
   * @param directory Directorio a escanear
   * @param testFiles Array donde almacenar los archivos encontrados
   * @param recursive Si debe escanear recursivamente
   */
  private async scanDirectory(
    directory: string, 
    testFiles: string[], 
    recursive: boolean
  ): Promise<void> {
    try {
      const entries = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
          // Saltar directorios comunes que no contienen tests
          if (this.shouldSkipDirectory(entry.name) && recursive) {
            continue;
          }
          
          if (recursive) {
            await this.scanDirectory(fullPath, testFiles, recursive);
          }
        } else if (entry.isFile() && this.isTestFile(fullPath)) {
          testFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not scan directory ${directory}:`, error);
    }
  }

  /**
   * Determina si debe saltarse un directorio durante el escaneo.
   * @param directoryName Nombre del directorio
   * @returns true si debe saltarse
   */
  private shouldSkipDirectory(directoryName: string): boolean {
    const skipDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      'playwright-report',
      'test-results',
      '.nyc_output',
      'screenshots'
    ];
    
    return skipDirs.includes(directoryName) || directoryName.startsWith('.');
  }
}

/**
 * Estadísticas de archivos escaneados.
 */
export interface FileStats {
  totalFiles: number;
  byExtension: Record<string, number>;
  byDirectory: Record<string, number>;
  averagePathLength: number;
}
