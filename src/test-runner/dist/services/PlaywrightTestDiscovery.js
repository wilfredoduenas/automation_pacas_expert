import * as fs from 'fs';
import * as path from 'path';
/**
 * Implementación concreta para descubrimiento de tests
 * Principio: Single Responsibility - Solo descubre tests
 * Principio: Open/Closed - Extensible para nuevos tipos de tests
 */
export class PlaywrightTestDiscovery {
    constructor(workspacePath) {
        this.workspacePath = workspacePath;
        this.testGroups = [];
        this.watchCallbacks = [];
    }
    async discoverTests() {
        const testGroups = [];
        // Descubrir tests por tipo
        const e2eTests = await this.discoverTestsByPattern('tests/e2e/**/*.spec.ts', 'e2e', 'E2E Tests', 'integration_instructions');
        const rulesTests = await this.discoverTestsByPattern('tests/rules/**/*.spec.ts', 'rules', 'Rules Tests', 'rule');
        const validationTests = await this.discoverTestsByPattern('tests/validation/**/*.spec.ts', 'validation', 'Validation Tests', 'verified_user');
        if (e2eTests.files.length > 0)
            testGroups.push(e2eTests);
        if (rulesTests.files.length > 0)
            testGroups.push(rulesTests);
        if (validationTests.files.length > 0)
            testGroups.push(validationTests);
        this.testGroups = testGroups;
        return testGroups;
    }
    async discoverTestsByType(type) {
        const pattern = `tests/${type}/**/*.spec.ts`;
        const group = await this.discoverTestsByPattern(pattern, type, `${type} Tests`, 'code');
        return group.files;
    }
    async discoverTestsByFile(filename) {
        const fullPath = path.join(this.workspacePath, filename);
        if (!fs.existsSync(fullPath)) {
            return [];
        }
        const content = await fs.promises.readFile(fullPath, 'utf-8');
        return this.parseTestCases(content, filename);
    }
    async watchForChanges(callback) {
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
    getTestGroups() {
        return this.testGroups;
    }
    async refreshTests() {
        return await this.discoverTests();
    }
    async findFiles(pattern) {
        const testDir = path.join(this.workspacePath, 'tests');
        const files = [];
        const walkDir = (dir, subPath = '') => {
            if (!fs.existsSync(dir))
                return;
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.join(subPath, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    walkDir(fullPath, relativePath);
                }
                else if (item.endsWith('.spec.ts')) {
                    files.push(path.join('tests', relativePath).replace(/\\/g, '/'));
                }
            }
        };
        walkDir(testDir);
        return files;
    }
    async discoverTestsByPattern(pattern, type, displayName, icon) {
        const files = await this.findFiles(pattern);
        const testFiles = [];
        let totalTests = 0;
        for (const file of files) {
            const fullPath = path.join(this.workspacePath, file);
            const stats = await fs.promises.stat(fullPath);
            const testCases = await this.parseTestCases(await fs.promises.readFile(fullPath, 'utf-8'), file);
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
    parseTestCases(content, filename) {
        const testCases = [];
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
    extractTags(content, testIndex) {
        // Buscar comentarios antes del test para extraer tags
        const beforeTest = content.substring(0, testIndex);
        const lines = beforeTest.split('\n');
        const tags = [];
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
    notifyWatchers(changes) {
        this.testGroups = changes.testGroups;
        this.watchCallbacks.forEach(callback => callback(changes));
    }
}
//# sourceMappingURL=PlaywrightTestDiscovery.js.map