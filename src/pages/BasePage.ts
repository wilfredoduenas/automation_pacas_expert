import { Page, Locator } from "@playwright/test";

export abstract class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  static readonly HOME_URL =
    "https://cxp-frontend-dev-110303813665.us-east1.run.app/";

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForElement(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: "visible", timeout });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
