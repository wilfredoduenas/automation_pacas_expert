import { TestGroup, TestFile, TestCase } from '../models/TestModels';
export type TestType = 'e2e' | 'rules' | 'validation' | 'api' | 'unit';
export interface TestChangeEvent {
    action: 'added' | 'modified' | 'deleted';
    filePath: string;
    testGroups: TestGroup[];
}
/**
 * Interface para descubrimiento automático de tests
 * Principio: Single Responsibility - Solo se encarga de descubrir tests
 */
export interface ITestDiscovery {
    discoverTests(): Promise<TestGroup[]>;
    discoverTestsByType(type: TestType): Promise<TestFile[]>;
    discoverTestsByFile(filename: string): Promise<TestCase[]>;
    watchForChanges(callback: (changes: TestChangeEvent) => void): Promise<void>;
    getTestGroups(): TestGroup[];
    refreshTests(): Promise<TestGroup[]>;
}
//# sourceMappingURL=ITestDiscovery.d.ts.map