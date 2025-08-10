import { test } from "@playwright/test";
import { EvidenceHelper } from "../../src/utils/EvidenceHelper";
import { CommonTestSteps } from "../../src/utils/CommonTestSteps";

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
    /**
     * Configurar test de validación
     */
    const { loginPage } = await CommonTestSteps.setupValidationTest(page);

    /**
     * Validar elementos de la página de login
     */
    await CommonTestSteps.validateLoginPageElements(loginPage);
  });
});
