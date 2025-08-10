import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import { PlaywrightTestDiscovery } from './services/PlaywrightTestDiscovery.js';

/**
 * Servidor simple del Test Runner sin dependencias externas
 * Principio: Single Responsibility - Solo maneja el servidor web básico
 */
class SimpleTestRunnerServer {
  private server: http.Server;
  private testDiscovery: PlaywrightTestDiscovery;
  private workspacePath: string;
  private webPath: string;

  constructor(workspacePath: string) {
    this.workspacePath = workspacePath;
    this.webPath = path.join(__dirname, 'web');
    this.testDiscovery = new PlaywrightTestDiscovery(workspacePath);
    
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const parsedUrl = url.parse(req.url || '', true);
    const pathname = parsedUrl.pathname || '/';

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      if (pathname === '/') {
        await this.serveFile(res, 'index.html', 'text/html');
      } else if (pathname === '/api/test-groups') {
        await this.handleApiTestGroups(res);
      } else if (pathname === '/api/refresh-tests') {
        await this.handleApiRefreshTests(res);
      } else if (pathname.startsWith('/api/')) {
        this.sendJson(res, { error: 'API endpoint not implemented yet' }, 501);
      } else {
        // Serve static files
        const filePath = pathname.slice(1); // Remove leading slash
        await this.serveStaticFile(res, filePath);
      }
    } catch (error) {
      console.error('Server error:', error);
      this.sendJson(res, { error: 'Internal server error' }, 500);
    }
  }

  private async handleApiTestGroups(res: http.ServerResponse): Promise<void> {
    try {
      const groups = await this.testDiscovery.discoverTests();
      this.sendJson(res, groups);
    } catch (error) {
      console.error('Error getting test groups:', error);
      this.sendJson(res, { error: 'Failed to get test groups' }, 500);
    }
  }

  private async handleApiRefreshTests(res: http.ServerResponse): Promise<void> {
    try {
      const groups = await this.testDiscovery.refreshTests();
      this.sendJson(res, { message: 'Tests refreshed', groups });
    } catch (error) {
      console.error('Error refreshing tests:', error);
      this.sendJson(res, { error: 'Failed to refresh tests' }, 500);
    }
  }

  private async serveFile(res: http.ServerResponse, filename: string, contentType: string): Promise<void> {
    const filePath = path.join(this.webPath, filename);
    
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  }

  private async serveStaticFile(res: http.ServerResponse, filePath: string): Promise<void> {
    const fullPath = path.join(this.webPath, filePath);
    
    // Security check - ensure file is within web directory
    if (!fullPath.startsWith(this.webPath)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    try {
      const stats = await fs.promises.stat(fullPath);
      if (!stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = this.getContentType(ext);
      
      const content = await fs.promises.readFile(fullPath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  }

  private getContentType(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    return mimeTypes[ext] || 'text/plain';
  }

  private sendJson(res: http.ServerResponse, data: any, statusCode: number = 200): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  public start(port: number = 3000): void {
    this.server.listen(port, () => {
      console.log(`Test Runner Server running on http://localhost:${port}`);
      console.log(`Workspace path: ${this.workspacePath}`);
      console.log(`Web files: ${this.webPath}`);
    });
  }

  public stop(): void {
    this.server.close();
  }
}

// Inicializar servidor si se ejecuta directamente
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  const workspacePath = process.argv[2] || process.cwd();
  const port = parseInt(process.argv[3]) || 3000;
  
  const server = new SimpleTestRunnerServer(workspacePath);
  server.start(port);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down Test Runner Server...');
    server.stop();
    process.exit(0);
  });
}

export { SimpleTestRunnerServer };
