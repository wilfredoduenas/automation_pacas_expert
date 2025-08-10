import { ITestRunner, TestResult as ITestResult, TestExecutionStatus as ITestExecutionStatus, TestType } from '../interfaces/ITestRunner';
import { ITestDiscovery } from '../interfaces/ITestDiscovery';
import { TestExecutionRequest, TestResult, TestExecutionStatus } from '../models/TestModels';
/**
 * Implementación concreta del runner de tests
 * Principio: Single Responsibility - Solo ejecuta tests
 * Principio: Dependency Inversion - Depende de abstracciones
 */
export declare class PlaywrightTestRunner implements ITestRunner {
    private testDiscovery;
    private workspacePath;
    private currentProcess;
    private executionStatus;
    private onProgressCallback?;
    private onResultCallback?;
    constructor(testDiscovery: ITestDiscovery, workspacePath: string);
    executeTest(testPath: string, testName?: string): Promise<ITestResult>;
    executeTestsByType(testType: TestType): Promise<ITestResult[]>;
    executeTestsByFile(filePath: string): Promise<ITestResult[]>;
    executeAllTests(): Promise<ITestResult[]>;
    getTestStatus(executionId: string): ITestExecutionStatus;
    cancelExecution(executionId?: string): Promise<void>;
    private generateExecutionId;
    private runPlaywrightCommand;
    executeTests(request: TestExecutionRequest): Promise<TestResult[]>;
    executeTestFile(filename: string, request: TestExecutionRequest): Promise<TestResult[]>;
    executeSpecificTest(filename: string, testName: string, request: TestExecutionRequest): Promise<TestResult>;
    isRunning(): boolean;
    getExecutionStatus(): TestExecutionStatus | null;
    onProgress(callback: (status: TestExecutionStatus) => void): void;
    onResult(callback: (result: TestResult) => void): void;
    private getTestFiles;
    private countTests;
    private buildPlaywrightArgs;
    private parsePlaywrightOutput;
    private mapPlaywrightStatus;
    private updateProgress;
}
//# sourceMappingURL=PlaywrightTestRunner.d.ts.map