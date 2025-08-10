import { ITestDiscovery, TestType, TestChangeEvent } from '../interfaces/ITestDiscovery';
import { TestGroup, TestFile, TestCase } from '../models/TestModels';
/**
 * Implementación concreta para descubrimiento de tests
 * Principio: Single Responsibility - Solo descubre tests
 * Principio: Open/Closed - Extensible para nuevos tipos de tests
 */
export declare class PlaywrightTestDiscovery implements ITestDiscovery {
    private workspacePath;
    private testGroups;
    private watchCallbacks;
    constructor(workspacePath: string);
    discoverTests(): Promise<TestGroup[]>;
    discoverTestsByType(type: TestType): Promise<TestFile[]>;
    discoverTestsByFile(filename: string): Promise<TestCase[]>;
    watchForChanges(callback: (changes: TestChangeEvent) => void): Promise<void>;
    getTestGroups(): TestGroup[];
    refreshTests(): Promise<TestGroup[]>;
    private findFiles;
    private discoverTestsByPattern;
    private parseTestCases;
    private extractTags;
    private notifyWatchers;
}
//# sourceMappingURL=PlaywrightTestDiscovery.d.ts.map