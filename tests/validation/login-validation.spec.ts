import { test } from "@playwright/test";
import { EvidenceHelper } from "../../src/utils/EvidenceHelper";
import { BasePage } from "../../src/pages/BasePage";
import { HomePage } from "../../src/pages/HomePage";
import { LoginPage } from "../../src/pages/LoginPage";

test.describe.parallel("Elementos de la página de login", () => {
  test.afterEach(async ({ page }, testInfo) => {
    const testName = testInfo.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");

    const status = testInfo.status === "passed" ? "SUCCESS" : "FAILED";
    await EvidenceHelper.captureFullPageScreenshot(
      page,
      `${testName}_${status}`
    );
  });
  test("Presencia de elementos en la página de login", async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await homePage.goto(BasePage.HOME_URL);
    await homePage.clickMenuSignIn();

    await loginPage.verifyWelcomeElements();
    await loginPage.verifyCredentialsElements();
    await loginPage.verifyAlternativeAccessElements();
  });
});
