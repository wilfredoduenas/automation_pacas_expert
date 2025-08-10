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

  /**
   * Escenario: Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad (18 años)
   */
  test("Verificar que el calendario muestre por defecto el año y mes correcto para mayoría de edad", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de registro
     */
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);

    /**
     * Cuando el usuario hace clic en el selector de fecha de nacimiento
     */
    await registerPage.openDatePicker();

    /**
     * Entonces el calendario debe estar visible
     */
    await registerPage.expectCalendarVisible();

    /**
     * Y debe mostrar el año y mes correcto para que el usuario tenga 18 años
     * Los días habilitados deben corresponder a fechas válidas para mayoría de edad
     */
    await DateHelper.validateEnabledDays(registerPage);
  });

  /**
   * Escenario: Verificar que no se pueden navegar a meses que harían que el usuario tenga menos de 18 años
   */
  test("Verificar que no se pueden navegar a meses futuros que harían que el usuario tenga menos de 18 años", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de registro
     */
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);

    /**
     * Cuando el usuario abre el selector de fecha de nacimiento
     */
    await registerPage.openDatePicker();

    /**
     * Entonces el calendario debe estar visible
     */
    await registerPage.expectCalendarVisible();

    /**
     * Y los meses posteriores al mes actual no deben estar habilitados en el selector
     * porque harían que el usuario tenga menos de 18 años
     */
    await registerPage.clickCurrentDateHeader();
    await DateHelper.validateMonthRestrictions(registerPage);
  });

  /**
   * Escenario: Verificar que se puede seleccionar una fecha válida (mayor de 18 años)
   */
  test("Verificar que se puede seleccionar una fecha válida que hace que el usuario tenga más de 18 años", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de registro
     */
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);

    /**
     * Cuando el usuario abre el selector de fecha de nacimiento
     */
    await registerPage.openDatePicker();

    /**
     * Y selecciona una fecha que hace que tenga más de 18 años
     * Entonces la fecha debe ser seleccionada correctamente y el calendario debe cerrarse
     */
    await DateHelper.validateValidDateSelection(registerPage);
  });

  /**
   * Escenario: Verificar límite exacto - usuario con 17 años, 11 meses y 29 días no puede ser seleccionado
   */
  test("Verificar que no se puede seleccionar fecha que hace que el usuario tenga exactamente 17 años, 11 meses y 29 días", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de registro
     */
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);

    /**
     * Cuando el usuario abre el selector de fecha de nacimiento
     */
    await registerPage.openDatePicker();

    /**
     * Y calcula una fecha que haría que tenga exactamente 17 años, 11 meses y 29 días
     * Entonces esa fecha específica debe estar deshabilitada
     */
    await DateHelper.validateInvalidDateRestriction(registerPage);
  });

  /**
   * Escenario: Verificar navegación entre meses en el calendario
   */
  test("Verificar que se puede navegar entre meses usando las flechas del calendario", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de registro
     */
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);

    /**
     * Cuando el usuario abre el selector de fecha de nacimiento
     */
    await registerPage.openDatePicker();

    /**
     * Y hace clic en la flecha para ir al mes anterior
     */
    await registerPage.navigateToPreviousMonth();

    /**
     * Entonces el calendario debe mostrar el mes anterior
     */
    await registerPage.expectCalendarVisible();

    /**
     * Cuando hace clic en la flecha para ir al mes siguiente
     */
    await registerPage.navigateToNextMonth();

    /**
     * Entonces el calendario debe regresar al mes original
     */
    await registerPage.expectCalendarVisible();
  });

  /**
   * Escenario: Verificar que se puede cerrar el calendario sin seleccionar fecha
   */
  test("Verificar que se puede cerrar el calendario sin seleccionar una fecha", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de registro
     */
    const { registerPage } = await CommonTestSteps.setupRegisterRulesTest(page);

    /**
     * Cuando el usuario abre el selector de fecha de nacimiento
     */
    await registerPage.openDatePicker();

    /**
     * Entonces el calendario debe estar visible
     */
    await registerPage.expectCalendarVisible();

    /**
     * Cuando el usuario cierra el calendario
     */
    await registerPage.closeDatePicker();

    /**
     * Entonces el calendario debe estar oculto
     */
    await registerPage.expectCalendarHidden();
  });
});
