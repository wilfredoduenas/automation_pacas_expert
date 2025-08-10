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

  test("Verificar que el campo número de celular tenga el foco al abrir la página", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.expectCredentialsPhoneFocused();
  });

  test("Verificar que el botón de iniciar sesión esté deshabilitado al abrir la página", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que el botón de iniciar sesión esté habilitado al ingresar un número de celular válido", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.fillCredentialsPhone("987654321");
    await loginPage.expectCredentialsSignInButtonEnabled();
  });

  test("Verificar que el botón de registrarse en la sección de acceso alternativo esté habilitado", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.expectAlternativeAccessRegisterButtonEnabled();
  });

  test("Verificar que el botón de ingresar como invitado esté habilitado", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.expectAlternativeAccessGuestButtonEnabled();
  });

  test("Verificar que al ingresar un número de celular que inicie con un dígito distinto de 9, el botón de iniciar sesión esté deshabilitado y se muestre un mensaje de error", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.fillCredentialsPhone("123456789");
    await loginPage.expectCredentialsPhoneErrorMessageVisible();
    await loginPage.expectCredentialsPhoneErrorMessageToHaveText(
      "Número de celular debe iniciar en 9"
    );
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar un número de celular que no cumple con la longitud mínima, se muestre un mensaje de error", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.fillCredentialsPhone("9878");
    await loginPage.expectCredentialsPhoneMinLengthMessageVisible();
    await loginPage.expectCredentialsPhoneMinLengthMessageToHaveText(
      "Debe tener al menos 9 caracteres"
    );
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar letras en el campo de número de celular, se ignoren", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.fillCredentialsPhone("abc");
    await expect(loginPage.getCredentialsPhoneValue()).resolves.toBe("");
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar un número de celular que contenga letras, las letras sean ignoradas", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.fillCredentialsPhone("9876abc");
    await expect(loginPage.getCredentialsPhoneValue()).resolves.toBe("9876");
    await loginPage.expectCredentialsSignInButtonDisabled;
  });

  test("Verificar que al ingresar caracteres especiales en el campo de número de celular, se ignoren", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.fillCredentialsPhone("9876!@#$");
    await expect(loginPage.getCredentialsPhoneValue()).resolves.toBe("9876");
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al ingresar un número de celular que no cumple con el formato y borrar la entrada, se muestre un mensaje de error", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);

    await loginPage.fillCredentialsPhone("1234");
    await loginPage.expectCredentialsPhoneErrorMessageToHaveText(
      "Número de celular debe iniciar en 9"
    );
    await loginPage.fillCredentialsPhone("");
    await loginPage.expectCredentialsPhoneRequiredMessageVisible();
    await loginPage.expectCredentialsPhoneRequiredMessageToHaveText(
      "Número de celular es requerido"
    );
    await loginPage.expectCredentialsSignInButtonDisabled();
  });

  test("Verificar que al hacer clic en el link cambiaste el número de celular, se muestre el popup: Te ayudaremos", async ({
    page,
  }) => {
    const { loginPage } = await CommonTestSteps.setupRulesTest(page);
    await loginPage.clickCredentialsChangeLink();
    await loginPage.expectChangePhonePopupHeadingVisible();
    await loginPage.expectChangePhonePopupMessageVisible();
    await loginPage.expectChangePhonePopupButtonVisible();
    await loginPage.expectChangePhonePopupHeadingToHaveText(
      "¡Te ayudaremos a resolverlo!"
    );
  });
});
