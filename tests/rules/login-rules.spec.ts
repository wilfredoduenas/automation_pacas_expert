import { test, expect } from "@playwright/test";
import { EvidenceHelper } from "../../src/utils/EvidenceHelper";
import { CommonTestSteps } from "../../src/utils/CommonTestSteps";

test.describe.parallel("Reglas de negocio de la página de login", () => {
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

  test("Validación de campo requerido en número de celular", async ({ page }) => {
    // ✅ Usar step específico para rules
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    
    await test.step("Intentar enviar formulario sin número", async () => {
      // Implementar lógica específica de reglas de negocio
      // await loginPage.clickSignInButton();
      // await expect(loginPage.getPhoneRequiredMessage()).toBeVisible();
    });
  });

  test("Validación de formato de número de celular", async ({ page }) => {
    // ✅ Reutilizar setup común
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    
    await test.step("Ingresar número inválido", async () => {
      // await loginPage.fillPhoneNumber("123");
      // await loginPage.clickSignInButton();
      // await expect(loginPage.getPhoneFormatMessage()).toBeVisible();
    });
  });

  test("Validación de longitud mínima de número", async ({ page }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    
    await test.step("Probar número con menos de 9 dígitos", async () => {
      // await loginPage.fillPhoneNumber("12345678");
      // await loginPage.clickSignInButton();
      // await expect(loginPage.getPhoneMinLengthMessage()).toBeVisible();
    });
  });
});
