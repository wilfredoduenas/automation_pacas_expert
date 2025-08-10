const http = require('http');
const fs = require('fs');
const path = require('path');

class FileBasedTestRunner {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.testsPath = path.join(projectPath, 'tests');
    }

    /**
     * Descubre tests directamente del sistema de archivos
     */
    async discoverTests() {
        try {
            const testGroups = {
                validation: {
                    displayName: 'Validation Tests',
                    icon: 'verified_user',
                    files: [],
                    totalTests: 0
                },
                rules: {
                    displayName: 'Business Rules',
                    icon: 'rule',
                    files: [],
                    totalTests: 0
                },
                e2e: {
                    displayName: 'End-to-End',
                    icon: 'timeline',
                    files: [],
                    totalTests: 0
                }
            };

            // Verificar que existe la carpeta tests
            if (!fs.existsSync(this.testsPath)) {
                console.log('❌ Tests folder not found:', this.testsPath);
                return Object.values(testGroups);
            }

            // Leer cada tipo de test
            for (const [groupKey, group] of Object.entries(testGroups)) {
                const groupPath = path.join(this.testsPath, groupKey);
                
                if (fs.existsSync(groupPath)) {
                    const files = fs.readdirSync(groupPath)
                        .filter(file => file.endsWith('.spec.ts'));
                    
                    for (const file of files) {
                        const filePath = path.join(groupPath, file);
                        const tests = this.extractTestsFromFile(filePath);
                        
                        if (tests.length > 0) {
                            group.files.push({
                                name: file,
                                path: `tests/${groupKey}/${file}`,
                                tests: tests
                            });
                            group.totalTests += tests.length;
                        }
                    }
                }
            }

            console.log('✅ Tests discovered:', Object.values(testGroups).map(g => `${g.displayName}: ${g.totalTests}`).join(', '));
            return Object.values(testGroups);

        } catch (error) {
            console.error('❌ Error discovering tests:', error);
            return [];
        }
    }

    /**
     * Extrae tests de un archivo usando regex
     */
    extractTestsFromFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const tests = [];
            
            // Buscar declaraciones de test usando regex
            const testRegex = /test\s*\(\s*["'`]([^"'`]+)["'`]/g;
            let match;
            
            while ((match = testRegex.exec(content)) !== null) {
                tests.push({
                    name: match[1],
                    selected: false,
                    status: 'idle'
                });
            }
            
            return tests;
        } catch (error) {
            console.error(`❌ Error reading file ${filePath}:`, error);
            return [];
        }
    }
}

class SimpleTestServer {
    constructor(projectPath, port = 3000) {
        this.projectPath = projectPath;
        this.port = port;
        this.testRunner = new FileBasedTestRunner(projectPath);
        this.server = null;
    }

    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json'
        };
        return mimeTypes[ext] || 'text/plain';
    }

    serveStaticFile(filePath, res) {
        try {
            const fullPath = path.join(__dirname, 'src', 'test-runner', 'web', filePath);
            const data = fs.readFileSync(fullPath);
            const mimeType = this.getMimeType(filePath);
            res.writeHead(200, { 
                'Content-Type': mimeType,
                'Cache-Control': 'no-cache'
            });
            res.end(data);
        } catch (error) {
            console.log(`❌ File not found: ${filePath}`);
            res.writeHead(404);
            res.end('Not Found');
        }
    }

    start() {
        this.server = http.createServer(async (req, res) => {
            const url = new URL(req.url, `http://${req.headers.host}`);
            
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            try {
                if (url.pathname === '/' || url.pathname === '/index.html') {
                    this.serveStaticFile('index.html', res);
                } else if (url.pathname === '/styles/main.css') {
                    this.serveStaticFile('styles/main.css', res);
                } else if (url.pathname === '/scripts/testRunner.js') {
                    this.serveStaticFile('scripts/testRunner.js', res);
                } else if (url.pathname === '/api/test-groups') {
                    console.log('🔍 Loading tests from file system...');
                    const tests = await this.testRunner.discoverTests();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(tests));
                } else if (url.pathname === '/api/tests/refresh') {
                    console.log('🔄 Refreshing tests...');
                    const tests = await this.testRunner.discoverTests();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(tests));
                } else if (url.pathname === '/api/tests/execute' && req.method === 'POST') {
                    let body = '';
                    req.on('data', chunk => body += chunk);
                    req.on('end', async () => {
                        try {
                            const data = JSON.parse(body);
                            console.log('🚀 Executing real tests:', data);
                            
                            // Ejecutar tests reales con Playwright
                            const result = await this.executeRealTests(data);
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(result));
                        } catch (error) {
                            console.error('❌ Test execution error:', error);
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                success: false, 
                                error: error.message,
                                results: []
                            }));
                        }
                    });
                } else {
                    res.writeHead(404);
                    res.end('Not Found');
                }
            } catch (error) {
                console.error('❌ Server error:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: error.message }));
            }
        });

        this.server.listen(this.port, () => {
            console.log(`✅ Simple Test Server started!`);
            console.log(`🌐 http://localhost:${this.port}`);
            console.log(`📁 Project: ${this.projectPath}`);
        });
    }

    /**
     * Ejecuta tests reales usando Playwright CLI
     */
    async executeRealTests(options) {
        const { spawn } = require('child_process');
        const { type, files, testNames, selectedTests, runAll } = options;
        
        return new Promise((resolve) => {
            let args = ['playwright', 'test'];
            
            // Construir argumentos del comando
            if (runAll || type === 'all') {
                // Ejecutar todos los tests
                console.log('🚀 Running ALL tests');
            } else if (selectedTests && selectedTests.length > 0) {
                // Ejecutar tests específicos seleccionados
                console.log('🚀 Running selected tests:', selectedTests);
                
                // Para un solo test, usar estrategia con --project y título específico
                if (selectedTests.length === 1) {
                    const { file, test } = selectedTests[0];
                    
                    // Estrategia: Usar el nombre del archivo + título específico
                    args.push(file);
                    args.push('--project=chromium'); // Solo chromium para evitar múltiples workers
                    args.push('--grep', `"${test}"`); // Usar comillas para matching exacto
                    
                    console.log(`🎯 Running SINGLE test: "${test}"`);
                    console.log(`📁 In file: ${file}`);
                    console.log(`🔧 Command: npx playwright test ${file} --project=chromium --grep "${test}"`);
                } else {
                    // Para múltiples tests del mismo archivo
                    const fileTests = {};
                    selectedTests.forEach(({ file, test }) => {
                        if (!fileTests[file]) fileTests[file] = [];
                        fileTests[file].push(test);
                    });
                    
                    const firstFile = Object.keys(fileTests)[0];
                    if (firstFile) {
                        args.push(firstFile);
                        args.push('--project=chromium');
                        
                        const testsInFile = fileTests[firstFile];
                        // Crear regex con comillas para cada test
                        const quotedTests = testsInFile.map(test => `"${test}"`);
                        const regexPattern = `(${quotedTests.join('|')})`;
                        args.push('--grep', regexPattern);
                        console.log(`🎯 Running ${testsInFile.length} tests in file: ${firstFile}`);
                    }
                    
                    if (Object.keys(fileTests).length > 1) {
                        console.log('⚠️ Multiple files selected, executing first file only');
                    }
                }
                
            } else if (type && type !== 'all') {
                args.push(`tests/${type}/`);
                console.log(`🚀 Running tests for type: ${type}`);
            } else if (files && files.length > 0) {
                args.push(...files);
                console.log(`🚀 Running specific files: ${files.join(', ')}`);
            } else if (testNames && testNames.length > 0) {
                // Filtrar nombres válidos
                const validTestNames = testNames.filter(name => name && name !== null && name !== 'null');
                
                if (validTestNames.length > 0) {
                    validTestNames.forEach(name => {
                        args.push('--grep', name);
                    });
                    console.log(`🚀 Running specific tests: ${validTestNames.join(', ')}`);
                } else {
                    console.log('⚠️ No valid test names found, running all tests');
                }
            } else {
                console.log('🚀 No specific criteria, running all tests');
            }

            // Forzar evidencia
            args.push('--reporter=html');
            
            console.log('🔧 Executing command:', 'npx', args.join(' '));

            const playwrightProcess = spawn('npx', args, {
                cwd: this.projectPath,
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: true
            });

            let output = '';
            let errorOutput = '';
            const results = [];

            playwrightProcess.stdout.on('data', (data) => {
                const chunk = data.toString();
                output += chunk;
                console.log('📊 Test output:', chunk);
                
                // Parsear resultados en tiempo real
                this.parseRealTimeResults(chunk, results);
            });

            playwrightProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
                console.error('⚠️ Test error:', data.toString());
            });

            playwrightProcess.on('close', (code) => {
                const success = code === 0;
                const finalResult = {
                    success: success,
                    exitCode: code,
                    message: success ? 'Tests ejecutados correctamente' : 'Algunos tests fallaron',
                    output: output,
                    error: errorOutput,
                    results: results.length > 0 ? results : this.parsePlaywrightResults(output),
                    evidenceGenerated: true,
                    reportPath: 'playwright-report/index.html'
                };
                
                console.log('✅ Test execution completed:', finalResult);
                resolve(finalResult);
            });

            // Timeout de seguridad
            setTimeout(() => {
                playwrightProcess.kill();
                resolve({
                    success: false,
                    message: 'Test execution timeout',
                    results: [],
                    error: 'Execution timed out after 5 minutes'
                });
            }, 300000); // 5 minutos
        });
    }

    /**
     * Parsea resultados en tiempo real
     */
    parseRealTimeResults(chunk, results) {
        const lines = chunk.split('\n');
        lines.forEach(line => {
            // Buscar líneas con resultados de tests
            if (line.includes('✓') || line.includes('✗') || line.includes('×') || line.includes('[chromium]')) {
                const passed = line.includes('✓');
                const failed = line.includes('✗') || line.includes('×');
                
                if (passed || failed) {
                    // Extraer nombre del test
                    let testName = line.replace(/[✓✗×]/g, '').trim();
                    testName = testName.replace(/\[chromium\]|\[firefox\]|\[webkit\]/g, '').trim();
                    testName = testName.replace(/\(\d+ms\)/g, '').trim();
                    
                    if (testName && !results.find(r => r.name === testName)) {
                        const duration = this.extractDuration(line);
                        const result = {
                            name: testName,
                            testId: testName, // Para compatibilidad con frontend
                            status: passed ? 'passed' : 'failed',
                            duration: duration || 0,
                            timestamp: new Date().toISOString()
                        };
                        
                        results.push(result);
                        console.log(`📊 Test result parsed: ${testName} - ${result.status} (${result.duration}ms)`);
                    }
                }
            }
        });
    }

    /**
     * Parsea resultados finales de Playwright
     */
    parsePlaywrightResults(output) {
        const results = [];
        const lines = output.split('\n');
        
        lines.forEach(line => {
            if (line.includes('✓') || line.includes('✗') || line.includes('×')) {
                const passed = line.includes('✓');
                const testName = line.replace(/[✓✗×]/g, '').trim();
                
                if (testName) {
                    results.push({
                        name: testName,
                        status: passed ? 'passed' : 'failed',
                        duration: this.extractDuration(line),
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });

        return results;
    }

    /**
     * Extrae duración del output
     */
    extractDuration(line) {
        const durationMatch = line.match(/(\d+)ms/);
        if (durationMatch) {
            return parseInt(durationMatch[1]);
        }
        
        // Buscar otros formatos de duración
        const secondsMatch = line.match(/(\d+\.?\d*)s/);
        if (secondsMatch) {
            return Math.round(parseFloat(secondsMatch[1]) * 1000);
        }
        
        return 0;
    }
}

const server = new SimpleTestServer(__dirname, 3000);
server.start();
