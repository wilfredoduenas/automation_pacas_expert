import { ITestUIManager } from '../interfaces/ITestUIManager';
import { TestGroup, TestExecutionStatus, TestResult } from '../models/TestModels';

/**
 * Implementación del gestor de UI para el Test Runner
 * Principio: Single Responsibility - Solo maneja la interfaz de usuario
 */
export class TestUIManager implements ITestUIManager {
  private connectedClients: Set<any> = new Set();

  async renderTestGroups(groups: TestGroup[]): Promise<void> {
    // Esta implementación se ejecuta en el servidor
    // La renderización real se hace en el cliente via WebSocket
    this.broadcastToClients('test-groups', { groups });
  }

  async updateTestStatus(testId: string, status: any): Promise<void> {
    this.broadcastToClients('test-status-update', { testId, status });
  }

  async updateExecutionProgress(progress: TestExecutionStatus): Promise<void> {
    this.broadcastToClients('execution-progress', { progress });
  }

  async showNotification(message: string, type: any): Promise<void> {
    this.broadcastToClients('notification', { message, type });
  }

  async showTestResult(result: TestResult): Promise<void> {
    this.broadcastToClients('test-result', { result });
  }

  async showTestLogs(logs: string[]): Promise<void> {
    this.broadcastToClients('test-logs', { logs });
  }

  addClient(client: any): void {
    this.connectedClients.add(client);
  }

  removeClient(client: any): void {
    this.connectedClients.delete(client);
  }

  private broadcastToClients(type: string, data: any): void {
    const message = JSON.stringify({ type, ...data });
    
    this.connectedClients.forEach((client) => {
      try {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(message);
        }
      } catch (error) {
        console.error('Error sending message to client:', error);
        this.connectedClients.delete(client);
      }
    });
  }
}
