import { TestGroup, TestExecutionStatus, TestResult } from '../models/TestModels';
/**
 * Interface para gestión de la interfaz de usuario
 * Principio: Single Responsibility - Solo se encarga de la UI
 */
export interface ITestUIManager {
    renderTestGroups(groups: TestGroup[]): Promise<void>;
    updateTestStatus(testId: string, status: TestStatus): Promise<void>;
    updateExecutionProgress(progress: TestExecutionStatus): Promise<void>;
    showNotification(message: string, type: NotificationType): Promise<void>;
    showTestResult(result: TestResult): Promise<void>;
    showTestLogs(logs: string[]): Promise<void>;
}
export interface IWebSocketManager {
    broadcast(event: string, data: any): void;
    onConnection(callback: (socket: any) => void): void;
    sendToClient(clientId: string, event: string, data: any): void;
}
export interface TestStatus {
    status: 'idle' | 'running' | 'passed' | 'failed' | 'skipped' | 'cancelled';
    progress?: number;
    message?: string;
    duration?: number;
}
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export interface UITestGroup {
    type: string;
    displayName: string;
    icon: string;
    files: UITestFile[];
    totalTests: number;
    expanded?: boolean;
}
export interface UITestFile {
    filename: string;
    path: string;
    tests: UITestCase[];
    selected?: boolean;
}
export interface UITestCase {
    id: string;
    name: string;
    status: TestStatus;
    selected?: boolean;
}
//# sourceMappingURL=ITestUIManager.d.ts.map