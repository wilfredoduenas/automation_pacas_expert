import { ITestUIManager } from '../interfaces/ITestUIManager';
import { TestGroup, TestExecutionStatus, TestResult } from '../models/TestModels';
/**
 * Implementación del gestor de UI para el Test Runner
 * Principio: Single Responsibility - Solo maneja la interfaz de usuario
 */
export declare class TestUIManager implements ITestUIManager {
    private connectedClients;
    renderTestGroups(groups: TestGroup[]): Promise<void>;
    updateTestStatus(testId: string, status: any): Promise<void>;
    updateExecutionProgress(progress: TestExecutionStatus): Promise<void>;
    showNotification(message: string, type: any): Promise<void>;
    showTestResult(result: TestResult): Promise<void>;
    showTestLogs(logs: string[]): Promise<void>;
    addClient(client: any): void;
    removeClient(client: any): void;
    private broadcastToClients;
}
//# sourceMappingURL=TestUIManager.d.ts.map