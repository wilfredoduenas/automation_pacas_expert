import { Page, Locator } from "@playwright/test";
import { join } from "path";

interface EvidenceConfig {
  baseDir: string;
  viewport: { width: number; height: number };
  timeout: number;
}

const defaultConfig: EvidenceConfig = {
  baseDir: "screenshots",
  viewport: { width: 1920, height: 1080 },
  timeout: 1000,
};

export class EvidenceHelper {
  private static config: EvidenceConfig = defaultConfig;

  static setConfig(config: Partial<EvidenceConfig>) {
    this.config = { ...this.config, ...config };
  }

  static async captureFullPageScreenshot(
    page: Page,
    testName: string
  ): Promise<string> {
    // Detectar tipo de test basado en el stack trace del archivo que llama
    let testType = "validation";
    const stack = new Error().stack;

    if (stack) {
      if (stack.includes("\\tests\\e2e\\") || stack.includes("/tests/e2e/")) {
        testType = "e2e";
      } else if (
        stack.includes("\\tests\\rules\\") ||
        stack.includes("/tests/rules/")
      ) {
        testType = "rules";
      } else if (
        stack.includes("\\tests\\validation\\") ||
        stack.includes("/tests/validation/")
      ) {
        testType = "validation";
      }
    }

    // Determinar el subdirectorio basado en SUCCESS/FAILED
    let statusSubDir = "success";
    if (/FAILED/i.test(testName)) {
      statusSubDir = "error";
    } else if (/SUCCESS/i.test(testName)) {
      statusSubDir = "success";
    }

    const cleanTestName = testName.replace(/[^a-zA-Z0-9]/g, "_");
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${day}-${month}_${hour}-${minute}-${second}`;
    const fileName = `${cleanTestName}_${timestamp}.png`;

    // Crear ruta con subdirectorio de estado
    const evidenceDir = join(
      process.cwd(),
      this.config.baseDir,
      testType,
      statusSubDir
    );

    try {
      const fs = await import("fs");
      if (!fs.existsSync(evidenceDir)) {
        fs.mkdirSync(evidenceDir, { recursive: true });
      }
      const filePath = join(evidenceDir, fileName);
      await page.waitForTimeout(this.config.timeout);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(this.config.timeout + 500);
      const scrollHeight = await page.evaluate(
        () => document.body.scrollHeight
      );
      await page.setViewportSize({
        width: this.config.viewport.width,
        height: scrollHeight,
      });
      await page.screenshot({ path: filePath, fullPage: true, type: "png" });
      await page.setViewportSize(this.config.viewport);
      return filePath;
    } catch (error) {
      console.error("Error capturando pantalla:", error);
      return "";
    }
  }

  static async captureElementScreenshot(
    locator: Locator,
    testName: string
  ): Promise<string> {
    const cleanTestName = testName.replace(/[^a-zA-Z0-9]/g, "_");
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${day}-${month}_${hour}-${minute}-${second}`;
    const fileName = `ELEMENT_${cleanTestName}_${timestamp}.png`;
    const evidenceDir = join(process.cwd(), this.config.baseDir, "elements");
    try {
      const fs = await import("fs");
      if (!fs.existsSync(evidenceDir)) {
        fs.mkdirSync(evidenceDir, { recursive: true });
      }
      const filePath = join(evidenceDir, fileName);
      await locator.screenshot({ path: filePath });
      return filePath;
    } catch (error) {
      console.error("Error capturando elemento:", error);
      return "";
    }
  }
}
