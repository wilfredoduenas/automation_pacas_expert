/**
 * Test Runner UI Manager
 * Gestiona la interfaz de usuario del test runner
 */
class TestRunnerUI {
    constructor() {
        this.testGroups = [];
        this.selectedTests = new Set();
        this.isRunning = false;
        this.websocket = null;
        
        this.initializeUI();
        this.setupEventListeners();
        this.connectWebSocket();
    }

    initializeUI() {
        this.updateWorkersValue();
        this.loadTestGroups();
    }

    setupEventListeners() {
        // Header buttons
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.refreshTests();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        // Control buttons
        document.getElementById('runSelectedBtn').addEventListener('click', () => {
            this.runSelectedTests();
        });

        document.getElementById('runAllBtn').addEventListener('click', () => {
            this.runAllTests();
        });

        document.getElementById('stopBtn').addEventListener('click', () => {
            this.stopExecution();
        });

        // Configuration
        document.getElementById('workersRange').addEventListener('input', (e) => {
            document.getElementById('workersValue').textContent = e.target.value;
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterTests(e.target.value);
        });

        // Select all tests
        document.getElementById('selectAllTests').addEventListener('change', (e) => {
            this.selectAllTests(e.target.checked);
        });

        // Delegated event listeners for dynamic content
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('test-checkbox')) {
                this.handleTestSelection(e.target);
            } else if (e.target.classList.contains('file-checkbox')) {
                this.handleFileSelection(e.target);
            }
        });

        // Delegated click listeners for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.closest('.run-single-test')) {
                const button = e.target.closest('.run-single-test');
                const testId = button.dataset.testId;
                this.runSingleTest(testId);
            }
        });

        // Results panel
        document.getElementById('closeResultsBtn').addEventListener('click', () => {
            this.closeResults();
        });
    }

    connectWebSocket() {
        // Para la versión simplificada, cargar una sola vez
        this.showNotification('Modo standalone activado', 'info');
    }

    startPolling() {
        // ELIMINADO: Polling excesivo que causaba carga constante
        // Solo cargar al inicio, no cada 5 segundos
        console.log('📌 Polling disabled - load tests on demand only');
    }

    handleWebSocketMessage(data) {
        // Esta función se mantiene para compatibilidad futura
        // cuando se implemente WebSocket
        switch (data.type) {
            case 'test-groups':
                this.updateTestGroups(data.groups);
                break;
            case 'test-progress':
                this.updateProgress(data.progress);
                break;
            case 'test-result':
                this.updateTestResult(data.result);
                break;
            case 'execution-complete':
                this.handleExecutionComplete(data.results);
                break;
            case 'notification':
                this.showNotification(data.message, data.level);
                break;
        }
    }

    async loadTestGroups() {
        try {
            console.log('🔍 Loading real test groups...');
            const response = await fetch('/api/test-groups');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const groups = await response.json();
            console.log('📊 Loaded test groups:', groups);
            
            this.updateTestGroups(groups);
            // REMOVER mensaje emergente repetitivo
            // this.showNotification('Tests cargados correctamente', 'success');
        } catch (error) {
            console.error('❌ Error loading test groups:', error);
            this.showNotification(`Error al cargar los tests: ${error.message}`, 'error');
            
            // Fallback: mostrar mensaje instructivo
            this.showEmptyState();
        }
    }

    showEmptyState() {
        const container = document.getElementById('testGroups');
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-icon">warning</span>
                <h3>No se pudieron cargar los tests</h3>
                <p>Asegúrate de que:</p>
                <ul>
                    <li>Playwright está instalado</li>
                    <li>Los tests están en la carpeta tests/</li>
                    <li>El servidor tiene acceso al proyecto</li>
                </ul>
                <button onclick="testRunner.refreshTests()" class="btn-primary">
                    <span class="material-icons">refresh</span>
                    Reintentar
                </button>
            </div>
        `;
    }

    updateTestGroups(groups) {
        this.testGroups = groups;
        this.renderTestGroups();
        this.renderTestList();
    }

    renderTestGroups() {
        const container = document.getElementById('testGroups');
        container.innerHTML = '';

        this.testGroups.forEach(group => {
            const groupElement = this.createTestGroupElement(group);
            container.appendChild(groupElement);
        });
    }

    createTestGroupElement(group) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'test-group-summary';
        groupDiv.innerHTML = `
            <div class="test-group-card">
                <div class="test-group-info">
                    <span class="material-icons test-group-icon">${group.icon}</span>
                    <div class="test-group-details">
                        <span class="test-group-name">${group.displayName}</span>
                        <span class="test-group-count">${group.totalTests} tests</span>
                    </div>
                </div>
            </div>
        `;

        return groupDiv;
    }

    createTestFileElement(file) {
        const testsHtml = file.tests.map(test => `
            <div class="test-item" data-test-id="${file.path}::${test.name}" data-test-name="${test.name}" data-file-path="${file.path}">
                <div class="test-info">
                    <input type="checkbox" class="test-checkbox" 
                           id="test-${file.path.replace(/[^a-zA-Z0-9]/g, '_')}_${test.name.replace(/[^a-zA-Z0-9]/g, '_')}" 
                           data-test-id="${file.path}::${test.name}" />
                    <label for="test-${file.path.replace(/[^a-zA-Z0-9]/g, '_')}_${test.name.replace(/[^a-zA-Z0-9]/g, '_')}" class="test-name">${test.name}</label>
                </div>
                <div class="test-status">
                    <span class="status-badge status-idle">
                        <span class="material-icons test-status-icon">radio_button_unchecked</span>
                        No iniciado
                    </span>
                </div>
                <div class="test-duration">--</div>
                <div class="test-actions">
                    <button class="btn-icon run-single-test" data-test-id="${file.path}::${test.name}" title="Ejecutar solo este test">
                        <span class="material-icons">play_arrow</span>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <div class="test-file" data-file="${file.path}">
                <div class="test-file-header">
                    <input type="checkbox" class="file-checkbox" id="file-${file.path.replace(/[^a-zA-Z0-9]/g, '_')}" />
                    <label for="file-${file.path.replace(/[^a-zA-Z0-9]/g, '_')}" class="test-file-name">${file.name}</label>
                    <span class="test-file-count">${file.tests.length} tests</span>
                </div>
                <div class="test-file-tests">
                    ${testsHtml}
                </div>
            </div>
        `;
    }

    renderTestList() {
        const container = document.getElementById('testList');
        container.innerHTML = '';

        this.testGroups.forEach(group => {
            group.files.forEach(file => {
                // Usar createTestFileElement que tiene la estructura correcta
                const fileElement = document.createElement('div');
                fileElement.innerHTML = this.createTestFileElement(file);
                
                // Agregar todos los test items del archivo
                const testItems = fileElement.querySelectorAll('.test-item');
                testItems.forEach(testItem => {
                    container.appendChild(testItem);
                });
            });
        });
    }

    getStatusIcon(status) {
        const icons = {
            idle: 'radio_button_unchecked',
            running: 'hourglass_empty',
            passed: 'check_circle',
            failed: 'error',
            skipped: 'skip_next',
            cancelled: 'cancel'
        };
        return icons[status] || 'radio_button_unchecked';
    }

    updateSelectAllState() {
        const selectAllCheckbox = document.getElementById('selectAllTests');
        const totalTests = document.querySelectorAll('#testList .test-checkbox').length;
        const selectedCount = this.selectedTests.size;

        selectAllCheckbox.checked = selectedCount === totalTests && totalTests > 0;
        selectAllCheckbox.indeterminate = selectedCount > 0 && selectedCount < totalTests;
        
        // Update counter
        document.getElementById('selectedCount').textContent = selectedCount;
    }

    handleTestSelection(checkbox) {
        const testId = checkbox.dataset.testId;
        const testItem = checkbox.closest('.test-item');
        
        if (checkbox.checked) {
            this.selectedTests.add(testId);
            testItem.classList.add('selected');
        } else {
            this.selectedTests.delete(testId);
            testItem.classList.remove('selected');
        }
        
        // Update file checkbox state
        this.updateFileCheckboxState(checkbox.closest('.test-group'));
        this.updateSelectAllState();
    }

    handleFileSelection(checkbox) {
        const testGroup = checkbox.closest('.test-group');
        const testCheckboxes = testGroup.querySelectorAll('.test-checkbox');
        
        testCheckboxes.forEach(testCheckbox => {
            testCheckbox.checked = checkbox.checked;
            this.handleTestSelection(testCheckbox);
        });
    }

    updateFileCheckboxState(testGroup) {
        const fileCheckbox = testGroup.querySelector('.file-checkbox');
        const testCheckboxes = testGroup.querySelectorAll('.test-checkbox');
        const checkedCount = testGroup.querySelectorAll('.test-checkbox:checked').length;
        
        fileCheckbox.checked = checkedCount === testCheckboxes.length;
        fileCheckbox.indeterminate = checkedCount > 0 && checkedCount < testCheckboxes.length;
    }

    selectAllTests(checked) {
        const checkboxes = document.querySelectorAll('#testList input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = checked;
            const testId = checkbox.id.replace('test-', '');
            const testItem = checkbox.closest('.test-item');
            
            if (checked) {
                this.selectedTests.add(testId);
                testItem.classList.add('selected');
            } else {
                this.selectedTests.delete(testId);
                testItem.classList.remove('selected');
            }
        });
    }

    async runSelectedTests() {
        if (this.selectedTests.size === 0) {
            this.showNotification('Selecciona al menos un test para ejecutar', 'warning');
            return;
        }

        console.log('🚀 Running selected tests:', Array.from(this.selectedTests));
        
        // Convertir IDs de tests a formato que entiende el servidor
        const selectedTestData = Array.from(this.selectedTests).map(testId => {
            // El testId tiene formato "filePath::testName"
            const [filePath, testName] = testId.split('::');
            return { file: filePath, test: testName };
        });

        await this.executeTests({ selectedTests: selectedTestData });
    }

    async runAllTests() {
        console.log('🚀 Running ALL tests');
        await this.executeTests({ runAll: true });
    }

    async runSingleTest(testId) {
        console.log('🚀 Running single test:', testId);
        
        // Convertir testId a formato que entiende el servidor
        const [filePath, testName] = testId.split('::');
        const selectedTestData = [{ file: filePath, test: testName }];

        await this.executeTests({ selectedTests: selectedTestData });
    }

    async executeTests(params) {
        if (this.isRunning) {
            this.showNotification('Ya hay tests ejecutándose', 'warning');
            return;
        }

        try {
            this.isRunning = true;
            this.updateExecutionState(true);
            this.showProgress();
            
            this.showNotification('🚀 Iniciando ejecución de tests...', 'info');
            
            // Preparar datos para enviar al servidor
            const executionData = this.prepareExecutionData(params);
            
            console.log('🔧 Sending execution request:', executionData);
            
            const response = await fetch('/api/tests/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(executionData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📊 Execution result:', result);
            
            if (result.success) {
                this.showNotification(`✅ ${result.message}`, 'success');
                if (result.evidenceGenerated) {
                    this.showNotification('📸 Evidencia generada correctamente', 'success');
                }
            } else {
                this.showNotification(`❌ ${result.message || 'Error en la ejecución'}`, 'error');
            }
            
            // Actualizar UI con resultados
            this.handleExecutionComplete(result.results || []);
            
        } catch (error) {
            console.error('❌ Execution error:', error);
            this.showNotification(`❌ Error: ${error.message}`, 'error');
            this.handleExecutionComplete([]);
        } finally {
            this.isRunning = false;
            this.updateExecutionState(false);
        }
    }

    /**
     * Prepara los datos para la ejecución
     */
    prepareExecutionData(params) {
        const data = {};
        
        if (params.runAll) {
            data.runAll = true;
            console.log('🔧 Prepared for ALL tests execution');
        } else if (params.selectedTests && params.selectedTests.length > 0) {
            // Usar los tests seleccionados directamente
            data.selectedTests = params.selectedTests;
            console.log('🔧 Prepared selected tests:', params.selectedTests);
        } else if (params.tests && params.tests.length > 0) {
            // Convertir IDs de tests a nombres reales (legacy)
            const testNames = this.getTestNamesFromIds(params.tests);
            data.testNames = testNames;
            console.log('🔧 Prepared test names (legacy):', testNames);
        } else {
            // Fallback: ejecutar todos
            data.runAll = true;
            console.log('🔧 No specific selection, running all tests');
        }
        
        return data;
    }

    /**
     * Convierte IDs de tests a nombres reales
     */
    getTestNamesFromIds(testIds) {
        const testNames = [];
        
        // Buscar en todos los grupos de tests
        this.testGroups.forEach(group => {
            group.files.forEach(file => {
                file.tests.forEach(test => {
                    // El ID podría ser el nombre del test o un identificador
                    if (testIds.includes(test.name) || testIds.includes(`${file.name}-${test.name}`)) {
                        testNames.push(test.name);
                    }
                });
            });
        });
        
        // Si no se encontraron coincidencias, usar los IDs como nombres
        if (testNames.length === 0) {
            return testIds.filter(id => id && id !== null);
        }
        
        return testNames;
    }

    simulateTestExecution(params) {
        this.isRunning = true;
        this.updateExecutionState(true);
        this.showProgress();

        // Simular progreso
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            this.updateProgress({
                totalTests: 10,
                completedTests: Math.floor(progress / 10),
                passedTests: Math.floor(progress / 15),
                failedTests: Math.floor(progress / 25),
                skippedTests: 0,
                progress: progress,
                currentTest: `Test simulado ${Math.floor(progress / 10)}`
            });

            if (progress >= 100) {
                clearInterval(interval);
                this.handleExecutionComplete([
                    { testId: 'sim1', status: 'passed', duration: 150 },
                    { testId: 'sim2', status: 'passed', duration: 200 },
                    { testId: 'sim3', status: 'failed', duration: 180 }
                ]);
            }
        }, 500);
    }

    async stopExecution() {
        try {
            await fetch('/api/stop-execution', { method: 'POST' });
            this.showNotification('Ejecución detenida', 'info');
        } catch (error) {
            console.error('Error stopping execution:', error);
            this.showNotification('Error al detener la ejecución', 'error');
        }
        
        this.isRunning = false;
        this.updateExecutionState(false);
        this.hideProgress();
    }

    getConfiguration() {
        return {
            browser: document.getElementById('browserSelect').value,
            headless: document.getElementById('headlessToggle').checked,
            workers: parseInt(document.getElementById('workersRange').value),
            timeout: 30000,
            retries: 1
        };
    }

    updateExecutionState(running) {
        document.getElementById('runSelectedBtn').disabled = running;
        document.getElementById('runAllBtn').disabled = running;
        document.getElementById('stopBtn').disabled = !running;

        const actionButtons = document.querySelectorAll('.action-btn[title="Ejecutar test"]');
        actionButtons.forEach(btn => btn.disabled = running);
    }

    showProgress() {
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.style.display = 'block';
    }

    hideProgress() {
        const progressContainer = document.getElementById('progressContainer');
        progressContainer.style.display = 'none';
    }

    updateProgress(progress) {
        document.getElementById('progressStats').textContent = 
            `${progress.completedTests}/${progress.totalTests}`;
        
        document.getElementById('progressFill').style.width = `${progress.progress}%`;
        
        document.getElementById('progressDetails').textContent = 
            progress.currentTest ? `Ejecutando: ${progress.currentTest}` : 'Procesando...';
    }

    updateTestResult(result) {
        const testItem = document.querySelector(`[data-test-id="${result.testId}"]`);
        if (testItem) {
            const statusBadge = testItem.querySelector('.status-badge');
            statusBadge.className = `status-badge status-${result.status}`;
            
            const statusText = result.status === 'passed' ? 'Exitoso' : 
                              result.status === 'failed' ? 'Fallido' : 
                              result.status === 'running' ? 'Ejecutando' : 'Desconocido';
            
            statusBadge.innerHTML = `
                <span class="material-icons test-status-icon">${this.getStatusIcon(result.status)}</span>
                ${statusText}
            `;
            
            const durationElement = testItem.querySelector('.test-duration');
            durationElement.textContent = `${result.duration}ms`;
        }
    }

    handleExecutionComplete(results) {
        this.isRunning = false;
        this.updateExecutionState(false);
        this.hideProgress();
        
        // Actualizar estado visual de los tests en la UI
        this.updateTestStatesInUI(results);
        
        this.showResults(results);
        
        const passed = results.filter(r => r.status === 'passed').length;
        const failed = results.filter(r => r.status === 'failed').length;
        
        const message = `✅ Ejecución completada: ${passed} pasaron, ${failed} fallaron`;
        const type = failed > 0 ? 'warning' : 'success';
        
        this.showNotification(message, type);
    }

    /**
     * Actualiza el estado visual de los tests en la interfaz
     */
    updateTestStatesInUI(results) {
        console.log('🔄 Updating UI with results:', results);
        
        results.forEach(result => {
            let testElement = null;
            
            // Buscar elemento por data-test-id exacto
            if (result.testId) {
                testElement = document.querySelector(`[data-test-id="${result.testId}"]`);
            }
            
            // Si no encuentra por testId, buscar por nombre de test
            if (!testElement && result.name) {
                const testElements = document.querySelectorAll('.test-item');
                testElements.forEach(element => {
                    const testName = element.querySelector('.test-name')?.textContent?.trim();
                    if (testName && (
                        testName === result.name || 
                        testName.includes(result.name) || 
                        result.name.includes(testName)
                    )) {
                        testElement = element;
                    }
                });
            }
            
            if (testElement) {
                console.log(`✅ Updating test element for: ${result.name || result.testId}`);
                
                // Actualizar clase CSS para mostrar estado
                testElement.classList.remove('test-idle', 'test-running', 'test-passed', 'test-failed');
                testElement.classList.add(`test-${result.status}`);
                
                // Actualizar badge de estado
                const statusBadge = testElement.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.className = `status-badge status-${result.status}`;
                    const statusText = result.status === 'passed' ? 'Exitoso' : 
                                      result.status === 'failed' ? 'Fallido' : 'Ejecutando';
                    statusBadge.innerHTML = `
                        <span class="material-icons test-status-icon">${this.getStatusIcon(result.status)}</span>
                        ${statusText}
                    `;
                }
                
                // Mostrar duración
                const durationElement = testElement.querySelector('.test-duration');
                if (durationElement) {
                    durationElement.textContent = result.duration ? `${result.duration}ms` : '--';
                }
            } else {
                console.warn(`⚠️ Could not find test element for: ${result.name || result.testId}`);
                console.log('Available test elements:', Array.from(document.querySelectorAll('.test-item')).map(el => ({
                    testId: el.dataset.testId,
                    name: el.querySelector('.test-name')?.textContent
                })));
            }
        });
    }

    showResults(results) {
        const panel = document.getElementById('resultsPanel');
        const content = document.getElementById('resultsContent');
        
        content.innerHTML = `
            <div class="results-summary">
                <h4>Resumen de Ejecución</h4>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-value">${results.length}</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${results.filter(r => r.status === 'passed').length}</span>
                        <span class="stat-label">Pasaron</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${results.filter(r => r.status === 'failed').length}</span>
                        <span class="stat-label">Fallaron</span>
                    </div>
                </div>
            </div>
            <div class="results-list">
                ${results.map(result => this.createResultItem(result)).join('')}
            </div>
        `;
        
        panel.classList.add('open');
    }

    createResultItem(result) {
        const statusText = result.status === 'passed' ? 'Exitoso' : 
                          result.status === 'failed' ? 'Fallido' : 
                          result.status === 'running' ? 'Ejecutando' : 'Desconocido';
        
        return `
            <div class="result-item status-${result.status}">
                <div class="result-header">
                    <span class="status-badge status-${result.status}">
                        <span class="material-icons">${this.getStatusIcon(result.status)}</span>
                        ${statusText}
                    </span>
                    <span class="result-duration">${result.duration ? `${result.duration}ms` : '--'}</span>
                </div>
                <div class="result-test">${result.testId || result.name || 'Test desconocido'}</div>
                ${result.error ? `<div class="result-error">${result.error}</div>` : ''}
            </div>
        `;
    }

    closeResults() {
        document.getElementById('resultsPanel').classList.remove('open');
    }

    filterTests(query) {
        const testItems = document.querySelectorAll('.test-item');
        const lowerQuery = query.toLowerCase();

        testItems.forEach(item => {
            const testName = item.querySelector('.test-name').textContent.toLowerCase();
            const fileName = item.querySelector('.test-file').textContent.toLowerCase();
            
            const matches = testName.includes(lowerQuery) || fileName.includes(lowerQuery);
            item.style.display = matches ? 'grid' : 'none';
        });
    }

    async refreshTests() {
        try {
            this.showNotification('🔄 Redescubriendo tests...', 'info');
            
            const response = await fetch('/api/tests/refresh');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const groups = await response.json();
            console.log('🔄 Refreshed test groups:', groups);
            
            this.updateTestGroups(groups);
            this.showNotification('✅ Tests actualizados correctamente', 'success');
        } catch (error) {
            console.error('❌ Error refreshing tests:', error);
            this.showNotification(`❌ Error al actualizar: ${error.message}`, 'error');
        }
    }

    showSettings() {
        // Implementar modal de configuración
        this.showNotification('Configuración próximamente', 'info');
    }

    showTestDetails(test) {
        // Implementar modal de detalles del test
        this.showNotification('Detalles próximamente', 'info');
    }

    updateWorkersValue() {
        const range = document.getElementById('workersRange');
        const display = document.getElementById('workersValue');
        display.textContent = range.value;
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <span class="material-icons notification-icon">${icon}</span>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <span class="material-icons">close</span>
            </button>
        `;
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        return icons[type] || 'info';
    }
}

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.testRunnerUI = new TestRunnerUI();
});
