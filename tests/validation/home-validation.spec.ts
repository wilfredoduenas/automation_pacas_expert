import { test } from "@playwright/test";
import { EvidenceHelper } from "../../src/utils/EvidenceHelper";
import { BasePage } from "../../src/pages/BasePage";
import { HomePage } from "../../src/pages/HomePage";

test.describe.parallel("Elementos de la página de inicio", () => {
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
  test("Presencia de elementos en la página de inicio", async ({
    page,
  }, testInfo) => {
    const homePage = new HomePage(page);
    await homePage.goto(BasePage.HOME_URL);

    await homePage.verifyMenuElements();
    await homePage.verifyCarouselElements();
    await homePage.verifyExpertElements();
    await homePage.verifyBenefitsElements();
    await homePage.verifyCoursesElements();
    await homePage.verifyNewsElements();
    await homePage.verifyPreFooterElements();
    await homePage.verifyFooterElements();
  });
});
