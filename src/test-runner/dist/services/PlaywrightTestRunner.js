import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
/**
 * Implementación concreta del runner de tests
 * Principio: Single Responsibility - Solo ejecuta tests
 * Principio: Dependency Inversion - Depende de abstracciones
 */
export class PlaywrightTestRunner {
    constructor(testDiscovery, workspacePath) {
        this.testDiscovery = testDiscovery;
        this.workspacePath = workspacePath;
        this.currentProcess = null;
        this.executionStatus = null;
    }
    // Implementación de métodos requeridos por ITestRunner
    async executeTest(testPath, testName) {
        const executionId = this.generateExecutionId();
        const startTime = new Date();
        try {
            const args = ['playwright', 'test', testPath];
            if (testName) {
                args.push('--grep', testName);
            }
            args.push('--reporter=json');
            const result = await this.runPlaywrightCommand(args);
            return {
                executionId,
                testName: testName || path.basename(testPath),
                filePath: testPath,
                status: result.code === 0 ? 'passed' : 'failed',
                duration: Date.now() - startTime.getTime(),
                error: result.error,
                startTime,
                endTime: new Date(),
                logs: result.output.split('\n').filter(line => line.trim())
            };
        }
        catch (error) {
            return {
                executionId,
                testName: testName || path.basename(testPath),
                filePath: testPath,
                status: 'failed',
                duration: Date.now() - startTime.getTime(),
                error: error instanceof Error ? error.message : String(error),
                startTime,
                endTime: new Date()
            };
        }
    }
    async executeTestsByType(testType) {
        const files = await this.testDiscovery.discoverTestsByType(testType);
        const results = [];
        for (const file of files) {
            for (const test of file.tests) {
                const result = await this.executeTest(file.path, test.name);
                results.push(result);
            }
        }
        return results;
    }
    async executeTestsByFile(filePath) {
        const tests = await this.testDiscovery.discoverTestsByFile(filePath);
        const results = [];
        for (const test of tests) {
            const result = await this.executeTest(filePath, test.name);
            results.push(result);
        }
        return results;
    }
    async executeAllTests() {
        const groups = await this.testDiscovery.discoverTests();
        const results = [];
        for (const group of groups) {
            for (const file of group.files) {
                for (const test of file.tests) {
                    const result = await this.executeTest(file.path, test.name);
                    results.push(result);
                }
            }
        }
        return results;
    }
    getTestStatus(executionId) {
        // Por simplicidad, devolvemos un estado basado en el estado actual
        return {
            executionId,
            status: this.isRunning() ? 'running' : 'idle',
            totalTests: this.executionStatus?.totalTests || 0,
            completedTests: this.executionStatus?.completedTests || 0,
            passedTests: this.executionStatus?.passedTests || 0,
            failedTests: this.executionStatus?.failedTests || 0,
            currentTest: this.executionStatus?.currentTest,
            progress: this.executionStatus?.progress || 0
        };
    }
    async cancelExecution(executionId) {
        if (this.currentProcess) {
            this.currentProcess.kill('SIGTERM');
            this.currentProcess = null;
        }
    }
    // Métodos auxiliares privados
    generateExecutionId() {
        return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    async runPlaywrightCommand(args) {
        return new Promise((resolve) => {
            const process = spawn('npx', args, {
                cwd: this.workspacePath,
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let output = '';
            let errors = '';
            process.stdout?.on('data', (data) => {
                output += data.toString();
            });
            process.stderr?.on('data', (data) => {
                errors += data.toString();
            });
            process.on('close', (code) => {
                resolve({
                    code: code || 0,
                    output,
                    error: errors || undefined
                });
            });
            process.on('error', (error) => {
                resolve({
                    code: 1,
                    output: '',
                    error: error.message
                });
            });
        });
    }
    async executeTests(request) {
        if (this.currentProcess) {
            throw new Error('Tests are already running');
        }
        const results = [];
        const testFiles = await this.getTestFiles(request);
        this.executionStatus = {
            totalTests: await this.countTests(testFiles),
            completedTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            progress: 0,
            startTime: new Date()
        };
        try {
            for (const file of testFiles) {
                if (request.tests && request.tests.length > 0) {
                    // Ejecutar tests específicos
                    for (const testName of request.tests) {
                        const result = await this.executeSpecificTest(file, testName, request);
                        results.push(result);
                        this.updateProgress(result);
                    }
                }
                else {
                    // Ejecutar todo el archivo
                    const fileResults = await this.executeTestFile(file, request);
                    results.push(...fileResults);
                    fileResults.forEach(result => this.updateProgress(result));
                }
            }
        }
        catch (error) {
            await this.cancelExecution();
            throw error;
        }
        this.currentProcess = null;
        return results;
    }
    async executeTestFile(filename, request) {
        const results = [];
        const startTime = new Date();
        const args = this.buildPlaywrightArgs(filename, request);
        return new Promise((resolve, reject) => {
            this.currentProcess = spawn('npx', ['playwright', 'test', ...args], {
                cwd: this.workspacePath,
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let output = '';
            let errors = '';
            this.currentProcess.stdout?.on('data', (data) => {
                output += data.toString();
            });
            this.currentProcess.stderr?.on('data', (data) => {
                errors += data.toString();
            });
            this.currentProcess.on('close', (code) => {
                const duration = Date.now() - startTime.getTime();
                try {
                    const parsedResults = this.parsePlaywrightOutput(output, filename, duration);
                    resolve(parsedResults);
                }
                catch (parseError) {
                    reject(new Error(`Failed to parse test results: ${parseError}`));
                }
            });
            this.currentProcess.on('error', (error) => {
                reject(error);
            });
        });
    }
    async executeSpecificTest(filename, testName, request) {
        const args = this.buildPlaywrightArgs(filename, request);
        args.push('--grep', testName);
        const startTime = new Date();
        return new Promise((resolve, reject) => {
            this.currentProcess = spawn('npx', ['playwright', 'test', ...args], {
                cwd: this.workspacePath,
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let output = '';
            let errors = '';
            this.currentProcess.stdout?.on('data', (data) => {
                output += data.toString();
            });
            this.currentProcess.stderr?.on('data', (data) => {
                errors += data.toString();
            });
            this.currentProcess.on('close', (code) => {
                const duration = Date.now() - startTime.getTime();
                const result = {
                    testId: `${filename}::${testName}`,
                    filename,
                    status: code === 0 ? 'passed' : 'failed',
                    duration,
                    error: errors || undefined,
                    logs: output.split('\n').filter(line => line.trim()),
                    timestamp: new Date()
                };
                resolve(result);
            });
            this.currentProcess.on('error', (error) => {
                reject(error);
            });
        });
    }
    isRunning() {
        return this.currentProcess !== null;
    }
    getExecutionStatus() {
        return this.executionStatus;
    }
    onProgress(callback) {
        this.onProgressCallback = callback;
    }
    onResult(callback) {
        this.onResultCallback = callback;
    }
    async getTestFiles(request) {
        if (request.files && request.files.length > 0) {
            return request.files;
        }
        const groups = await this.testDiscovery.discoverTests();
        const files = [];
        for (const group of groups) {
            if (!request.groups || request.groups.includes(group.type)) {
                files.push(...group.files.map((f) => f.path));
            }
        }
        return files;
    }
    async countTests(files) {
        let total = 0;
        for (const file of files) {
            const content = await fs.promises.readFile(file, 'utf-8');
            const testMatches = content.match(/test\(/g);
            total += testMatches ? testMatches.length : 0;
        }
        return total;
    }
    buildPlaywrightArgs(filename, request) {
        const args = [filename];
        if (request.configuration.browser) {
            args.push('--project', request.configuration.browser);
        }
        if (request.configuration.headless === false) {
            args.push('--headed');
        }
        if (request.configuration.workers) {
            args.push('--workers', request.configuration.workers.toString());
        }
        if (request.configuration.timeout) {
            args.push('--timeout', request.configuration.timeout.toString());
        }
        if (request.configuration.retries) {
            args.push('--retries', request.configuration.retries.toString());
        }
        args.push('--reporter=json');
        return args;
    }
    parsePlaywrightOutput(output, filename, duration) {
        const results = [];
        try {
            const jsonOutput = output.split('\n').find(line => line.startsWith('{'));
            if (jsonOutput) {
                const report = JSON.parse(jsonOutput);
                if (report.suites) {
                    for (const suite of report.suites) {
                        for (const spec of suite.specs) {
                            for (const test of spec.tests) {
                                results.push({
                                    testId: `${filename}::${test.title}`,
                                    filename,
                                    status: this.mapPlaywrightStatus(test.status),
                                    duration: test.duration || duration,
                                    error: test.error ? test.error.message : undefined,
                                    logs: test.stdout ? test.stdout.split('\n') : [],
                                    timestamp: new Date()
                                });
                            }
                        }
                    }
                }
            }
        }
        catch (error) {
            // Fallback si no se puede parsear JSON
            results.push({
                testId: `${filename}::unknown`,
                filename,
                status: 'failed',
                duration,
                error: 'Failed to parse test output',
                logs: output.split('\n'),
                timestamp: new Date()
            });
        }
        return results;
    }
    mapPlaywrightStatus(status) {
        switch (status) {
            case 'passed': return 'passed';
            case 'failed': return 'failed';
            case 'skipped': return 'skipped';
            case 'interrupted': return 'cancelled';
            default: return 'failed';
        }
    }
    updateProgress(result) {
        if (this.executionStatus) {
            this.executionStatus.completedTests++;
            switch (result.status) {
                case 'passed':
                    this.executionStatus.passedTests++;
                    break;
                case 'failed':
                    this.executionStatus.failedTests++;
                    break;
                case 'skipped':
                    this.executionStatus.skippedTests++;
                    break;
            }
            this.executionStatus.progress =
                (this.executionStatus.completedTests / this.executionStatus.totalTests) * 100;
            if (this.onProgressCallback) {
                this.onProgressCallback(this.executionStatus);
            }
            if (this.onResultCallback) {
                this.onResultCallback(result);
            }
        }
    }
}
//# sourceMappingURL=PlaywrightTestRunner.js.map