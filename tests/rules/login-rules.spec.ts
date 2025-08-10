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

  /**
   * Escenario: Verificar que el campo número de celular tenga el foco al abrir la página
   */
  test("Verificar que el campo número de celular tenga el foco al abrir la página", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Entonces el campo número de celular debe tener el foco
     */
    await loginPage.expectCredentialsPhoneFocused();
  });

  /**
   * Escenario: Verificar que el botón de iniciar sesión esté deshabilitado al abrir la página
   */
  test("Verificar que el botón de iniciar sesión esté deshabilitado al abrir la página", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    /**
     * Entonces el botón de iniciar sesión debe estar deshabilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  /**
   * Escenario: Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido
   */
  test("Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa un número de celular válido
     */
    await loginPage.fillCredentialsPhone("987654321");
    /**
     * Entonces el botón de iniciar sesión debe estar habilitado
     */
    await loginPage.expectCredentialsSignInButtonEnabled();
  });

  /**
   * Escenario: Verificar que el botón de registrarse en la sección de acceso alternativo esté habilitado
   */
  test("Verificar que el botón de registrarse en la sección de acceso alternativo esté habilitado", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Entonces el botón de registrarse en la sección de acceso alternativo debe estar habilitado
     */
    await loginPage.expectAlternativeAccessRegisterButtonEnabled();
  });

  /**
   * Escenario: Verificar que el botón de ingresar como invitado esté habilitado
   */
  test("Verificar que el botón de ingresar como invitado esté habilitado", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Entonces el botón de ingresar como invitado debe estar habilitado
     */
    await loginPage.expectAlternativeAccessGuestButtonEnabled();
  });

  /**
   * Escenario: Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error
   */
  test("Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa un número de celular que inicia con un dígito distinto de 9
     */
    await loginPage.fillCredentialsPhone("123456789");

    /**
     * Entonces el mensaje de error general del teléfono debe estar visible.
     */
    await loginPage.expectCredentialsPhoneErrorMessageVisible();

    /**
     * Y se muestra el mensaje de error: Número de celular debe iniciar en 9.
     */
    await loginPage.expectCredentialsPhoneErrorMessageToHaveText(
      "Número de celular debe iniciar en 9"
    );

    /**
     * Y el botón de iniciar sesión debe estar deshabilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa un número de celular que no cumple con la longitud mínima
     */
    await loginPage.fillCredentialsPhone("9878");

    /**
     * Entonces el mensaje de error general del teléfono debe estar visible.
     */
    await loginPage.expectCredentialsPhoneMinLengthMessageVisible();

    /**
     * Y se muestra el mensaje de error: Debe tener al menos 9 caracteres.
     */
    await loginPage.expectCredentialsPhoneMinLengthMessageToHaveText(
      "Debe tener al menos 9 caracteres"
    );

    /**
     * Y el botón de iniciar sesión debe estar deshabilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar letras en el campo de número de celular, se ignoren", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa letras en el campo de número de celular
     */
    await loginPage.fillCredentialsPhone("abc");

    /**
     * Entonces el valor del campo de número de celular debe ser vacío
     */
    await expect(loginPage.getCredentialsPhoneValue()).resolves.toBe("");

    /**
     * Y el botón de iniciar sesión debe estar deshabilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  /**
   * Escenario: Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas
   */
  test("Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa un número de celular que contiene letras
     */
    await loginPage.fillCredentialsPhone("9876abc");

    /**
     * Entonces el valor del campo de número de celular debe ser solo numérico
     */
    await expect(loginPage.getCredentialsPhoneValue()).resolves.toBe("9876");

    /**
     * Y el botón de iniciar sesión debe estar habilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled;
  });

  test("Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa caracteres especiales en el campo de número de celular
     */
    await loginPage.fillCredentialsPhone("9876!@#$");

    /**
     * Entonces el valor del campo de número de celular debe ser solo numérico
     */
    await expect(loginPage.getCredentialsPhoneValue()).resolves.toBe("9876");

    /**
     * Y el botón de iniciar sesión debe estar habilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario ingresa un número de celular que no cumple con el formato
     */
    await loginPage.fillCredentialsPhone("1234");

    /**
     * Y se muestra el mensaje de error: Número de celular debe iniciar en 9.
     */
    await loginPage.expectCredentialsPhoneErrorMessageToHaveText(
      "Número de celular debe iniciar en 9"
    );

    /**
     * Y se borra la entrada
     */
    await loginPage.fillCredentialsPhone("");

    /**
     * Entonces el mensaje de error de formato debe estar visible.
     */
    await loginPage.expectCredentialsPhoneRequiredMessageVisible();

    /**
     * Y se muestra el mensaje de error: Número de celular es requerido.
     */
    await loginPage.expectCredentialsPhoneRequiredMessageToHaveText(
      "Número de celular es requerido"
    );

    /**
     * Y el botón de iniciar sesión debe estar deshabilitado
     */
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  /**
   * Escenario: Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos
   */
  test("Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos", async ({
    page,
  }) => {
    /**
     * Dado que el usuario se encuentra en la página de login
     */
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    /**
     * Cuando el usuario hace clic en el link "cambiaste el número de celular"
     */
    await loginPage.clickCredentialsChangeLink();

    /**
     * Entonces se debe mostrar el popup: Te ayudaremos a resolverlo
     */

    await loginPage.expectChangePhonePopupHeadingVisible();
    await loginPage.expectChangePhonePopupMessageVisible();
    await loginPage.expectChangePhonePopupButtonVisible();

    /**
     * Y el encabezado del popup debe tener el texto ¡Te ayudaremos a resolverlo!.
     */
    await loginPage.expectChangePhonePopupHeadingToHaveText("¡Te ayudaremos a resolverlo!");

  });
});
