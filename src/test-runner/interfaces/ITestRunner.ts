/**
 * Interface para ejecutar tests
 * Principio: Single Responsibility - Solo se encarga de ejecución
 */
export interface ITestRunner {
  executeTest(testPath: string, testName?: string): Promise<TestResult>;
  executeTestsByType(testType: TestType): Promise<TestResult[]>;
  executeTestsByFile(filePath: string): Promise<TestResult[]>;
  executeAllTests(): Promise<TestResult[]>;
  getTestStatus(executionId: string): TestExecutionStatus;
  cancelExecution(executionId: string): Promise<void>;
}

export interface TestResult {
  executionId: string;
  testName: string;
  filePath: string;
  status: 'passed' | 'failed' | 'skipped' | 'running';
  duration?: number;
  error?: string;
  startTime: Date;
  endTime?: Date;
  screenshots?: string[];
  logs?: string[];
}

export interface TestExecutionStatus {
  executionId: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  totalTests: number;
  completedTests: number;
  passedTests: number;
  failedTests: number;
  currentTest?: string;
  progress: number;
}

export type TestType = 'validation' | 'rules' | 'e2e' | 'integration' | 'performance' | 'unit';
