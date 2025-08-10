export type TestType = 'e2e' | 'rules' | 'validation' | 'api' | 'unit';

export interface TestGroup {
  type: TestType;
  displayName: string;
  icon: string;
  files: TestFile[];
  totalTests: number;
  statistics: TestGroupStatistics;
}

export interface TestFile {
  filename: string;
  path: string;
  tests: TestCase[];
  lastModified: Date;
  size: number;
}

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  status: TestStatus;
  duration?: number;
  error?: string;
  logs?: string[];
  tags?: string[];
}

export interface TestResult {
  testId: string;
  filename: string;
  status: 'passed' | 'failed' | 'skipped' | 'cancelled';
  duration: number;
  error?: string;
  logs: string[];
  screenshots?: string[];
  timestamp: Date;
}

export interface TestExecutionStatus {
  totalTests: number;
  completedTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  progress: number;
  currentTest?: string;
  estimatedTimeRemaining?: number;
  startTime: Date;
}

export interface TestGroupStatistics {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  running: number;
  idle: number;
}

export interface TestStatus {
  status: 'idle' | 'running' | 'passed' | 'failed' | 'skipped' | 'cancelled';
  progress?: number;
  message?: string;
  duration?: number;
}

export interface TestConfiguration {
  browser: string;
  headless: boolean;
  workers: number;
  timeout: number;
  retries: number;
  baseURL?: string;
}

export interface TestFilters {
  groups?: string[];
  status?: string[];
  tags?: string[];
  filename?: string;
  testName?: string;
}

export interface TestExecutionRequest {
  groups?: string[];
  files?: string[];
  tests?: string[];
  configuration: TestConfiguration;
  filters?: TestFilters;
}
