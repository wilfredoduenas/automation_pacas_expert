/**
 * Implementación del gestor de UI para el Test Runner
 * Principio: Single Responsibility - Solo maneja la interfaz de usuario
 */
export class TestUIManager {
    constructor() {
        this.connectedClients = new Set();
    }
    async renderTestGroups(groups) {
        // Esta implementación se ejecuta en el servidor
        // La renderización real se hace en el cliente via WebSocket
        this.broadcastToClients('test-groups', { groups });
    }
    async updateTestStatus(testId, status) {
        this.broadcastToClients('test-status-update', { testId, status });
    }
    async updateExecutionProgress(progress) {
        this.broadcastToClients('execution-progress', { progress });
    }
    async showNotification(message, type) {
        this.broadcastToClients('notification', { message, type });
    }
    async showTestResult(result) {
        this.broadcastToClients('test-result', { result });
    }
    async showTestLogs(logs) {
        this.broadcastToClients('test-logs', { logs });
    }
    addClient(client) {
        this.connectedClients.add(client);
    }
    removeClient(client) {
        this.connectedClients.delete(client);
    }
    broadcastToClients(type, data) {
        const message = JSON.stringify({ type, ...data });
        this.connectedClients.forEach((client) => {
            try {
                if (client.readyState === 1) { // WebSocket.OPEN
                    client.send(message);
                }
            }
            catch (error) {
                console.error('Error sending message to client:', error);
                this.connectedClients.delete(client);
            }
        });
    }
}
//# sourceMappingURL=TestUIManager.js.map