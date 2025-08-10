/**
 * Servidor simple del Test Runner sin dependencias externas
 * Principio: Single Responsibility - Solo maneja el servidor web básico
 */
declare class SimpleTestRunnerServer {
    private server;
    private testDiscovery;
    private workspacePath;
    private webPath;
    constructor(workspacePath: string);
    private handleRequest;
    private handleApiTestGroups;
    private handleApiRefreshTests;
    private serveFile;
    private serveStaticFile;
    private getContentType;
    private sendJson;
    start(port?: number): void;
    stop(): void;
}
export { SimpleTestRunnerServer };
//# sourceMappingURL=server.d.ts.map