import { test, expect } from "@playwright/test";
import { EvidenceHelper } from "../../src/utils/EvidenceHelper";
import { CommonTestSteps } from "../../src/utils/CommonTestSteps";
import { DateHelper } from "../../src/utils/DateHelper";

test.describe.parallel("Reglas de negocio de la página de registro", () => {
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

  test("Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad", async ({
    page,
  }) => {
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);
    await registerPage.openDatePicker();
    await registerPage.expectCalendarVisible();
    await DateHelper.validateEnabledDays(registerPage);
  });

  test("Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años", async ({
    page,
  }) => {
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);
    await registerPage.openDatePicker();
    await registerPage.expectCalendarVisible();
    await registerPage.clickCurrentDateHeader();
    await DateHelper.validateMonthRestrictions(registerPage);
  });

  test("Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años", async ({
    page,
  }) => {
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);
    await registerPage.openDatePicker();
    await DateHelper.validateValidDateSelection(registerPage);
  });

  test("Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días", async ({
    page,
  }) => {
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);
    await registerPage.openDatePicker();
    await DateHelper.validateInvalidDateRestriction(registerPage);
  });

  test("Verificar que se puede navegar entre meses usando las flechas del calendario", async ({
    page,
  }) => {
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);
    await registerPage.openDatePicker();
    await registerPage.navigateToPreviousMonth();
    await registerPage.expectCalendarVisible();
    await registerPage.navigateToNextMonth();
    await registerPage.expectCalendarVisible();
  });

  test("Verificar que se puede cerrar el calendario sin seleccionar una fecha", async ({
    page,
  }) => {
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);
    await registerPage.openDatePicker();
    await registerPage.expectCalendarVisible();
    await registerPage.closeDatePicker();
    await registerPage.expectCalendarHidden();
  });
});
