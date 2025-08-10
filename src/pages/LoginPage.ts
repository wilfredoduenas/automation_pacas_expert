import { Locator, Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ILoginPage } from "../interfaces/ILoginPage";

/**
 * Page Object Model para la Home, centraliza locators y lógica de verificación.
 * Permite fácil extensión y mantenimiento.
 */
export class LoginPage extends BasePage implements ILoginPage {
  /**
   * Variables de la sección de credenciales.
   */
  private readonly credentialsPhoneInput: Locator;
  private readonly credentialsChangeLink: Locator;
  private readonly credentialsSignInButton: Locator;
  private readonly alternativeAccessRegisterButton: Locator;
  private readonly alternativeAccessGuestButton: Locator;

  /**
   * Variables de la sección de mensajes de error.
   */
  private readonly credentialsPhoneErrorMessage: Locator;
  private readonly credentialsPhoneRequiredMessage: Locator;
  private readonly credentialsPhoneMinLengthMessage: Locator;

  /**
   * Variables del popup "¿Cambiaste de número de celular?".
   */
  private readonly changePhonePopupHeading: Locator;
  private readonly changePhonePopupMessage: Locator;
  private readonly changePhonePopupButton: Locator;

  /**
   * Elementos de la sección de bienvenida.
   */
  private welcomeLocators = [
    () => this.page.getByRole("heading", { name: "¡Bienvenido!" }),
    () => this.page.getByText("Estás a un paso de acceder a"),
    () =>
      this.page
        .getByLabel("", { exact: true })
        .getByRole("img", { name: "bg-auth" }),
  ];

  /**
   * Elementos de la sección de credenciales.
   */
  private credentialsLocators = [
    () => this.page.getByRole("img", { name: "logo-cxp" }),
    () => this.page.getByText("Ingresa tu número de celular"),
    () => this.page.getByText("Número de celular", { exact: true }),
    () => this.page.getByRole("textbox", { name: "Número de celular" }),
    () => this.page.getByRole("link", { name: "¿Cambiaste de número de" }),
    () =>
      this.page
        .getByLabel("", { exact: true })
        .getByRole("button", { name: "Iniciar sesión" }),
  ];

  /**
   * Elementos de la sección de acceso alternativo.
   */
  private alternativeAccessLocators = [
    () => this.page.getByText("¿Aún no estás registrado?"),
    () => this.page.getByRole("button", { name: "Registrarse" }),
    () => this.page.getByRole("button", { name: "Ingresar como invitado" }),
  ];

  /**
   * Constructor for the LoginPage class.
   * @param page The Playwright page object.
   */
  constructor(page: Page) {
    super(page);

    /**
     * Elementos de la sección de credenciales.
     */
    this.credentialsPhoneInput = this.page.getByRole("textbox", {
      name: "Número de celular",
    });
    this.credentialsChangeLink = this.page.getByRole("link", {
      name: "¿Cambiaste de número de",
    });
    this.credentialsSignInButton = this.page
      .getByLabel("", { exact: true })
      .getByRole("button", { name: "Iniciar sesión" });

    /**
     * Elementos de la sección de acceso alternativo.
     */
    this.alternativeAccessRegisterButton = this.page.getByRole("button", {
      name: "Registrarse",
    });
    this.alternativeAccessGuestButton = this.page.getByRole("button", {
      name: "Ingresar como invitado",
    });

    /**
     * Elementos de la sección de mensajes de error.
     */
    this.credentialsPhoneErrorMessage = this.page.getByText(
      "Número de celular debe"
    );
    this.credentialsPhoneRequiredMessage = this.page.getByText(
      "Número de celular es requerido"
    );
    this.credentialsPhoneMinLengthMessage = this.page.getByText(
      "Debe tener al menos 9"
    );

    /**
     * Elementos del popup "¿Cambiaste de número de celular?".
     */
    this.changePhonePopupHeading = this.page.getByRole("heading", {
      name: "¡Te ayudaremos a resolverlo!",
    });
    this.changePhonePopupMessage = this.page.getByText(
      "Te llevaremos con Don Manuel"
    );
    this.changePhonePopupButton = this.page.getByRole("button", {
      name: "Ir a Don Manuel open_in_new",
    });
  }

  /**
   * Verifica la visibilidad de los elementos de la página de inicio.
   */
  public async verifyWelcomeElements(): Promise<void> {
    await this.verifySection(this.welcomeLocators, "Welcome Section");
  }

  /**
   * Verifica la visibilidad de los elementos de la sección de credenciales.
   */
  public async verifyCredentialsElements(): Promise<void> {
    await this.verifySection(this.credentialsLocators, "Credentials Section");
  }

  /**
   * Verifica la visibilidad de los elementos de la sección de acceso alternativo.
   */
  public async verifyAlternativeAccessElements(): Promise<void> {
    await this.verifySection(
      this.alternativeAccessLocators,
      "Alternative Access Section"
    );
  }

  /**
   * Verifica la visibilidad de los elementos en una sección dada.
   * @param locators Array de funciones que devuelven locators.
   * @param sectionName Nombre de la sección para el reporte.
   */
  private async verifySection(
    locators: Array<() => any>,
    sectionName: string
  ): Promise<void> {
    await test.step(`Verificar sección: ${sectionName}`, async () => {
      for (const locatorFn of locators) {
        try {
          const locator = locatorFn();
          await expect(locator).toBeVisible({ timeout: 7000 });
        } catch (error) {
          console.error(
            `Elemento no visible en sección [${sectionName}]:`,
            error
          );
          throw error;
        }
      }
    });
  }

  /**
   * Metodos para interactuar con la sección de credenciales.
   */

  /**
   * Rellena el campo de número de celular con el valor proporcionado.
   * @param phoneNumber El número de celular a ingresar.
   */
  public async fillCredentialsPhone(phoneNumber: string): Promise<void> {
    await this.credentialsPhoneInput.fill(phoneNumber);
  }

  /**
   * Obtiene el valor del campo de número de celular.
   * @returns El valor del campo de número de celular.
   */
  public async getCredentialsPhoneValue(): Promise<string> {
    return await this.credentialsPhoneInput.inputValue();
  }

  /**
   * Hace clic en el enlace para cambiar el número de celular.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el enlace.
   */
  public async clickCredentialsChangeLink(): Promise<void> {
    await this.credentialsChangeLink.click();
  }

  /**
   * Hace clic en el botón de iniciar sesión.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickCredentialsSignInButton(): Promise<void> {
    await this.credentialsSignInButton.click();
  }

  /**
   * Hace clic en el botón de registrarse.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickAlternativeAccessRegisterButton(): Promise<void> {
    await this.alternativeAccessRegisterButton.click();
  }

  /**
   * Hace clic en el botón de ingresar como invitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickAlternativeAccessGuestButton(): Promise<void> {
    await this.alternativeAccessGuestButton.click();
  }

  /**
   * Verifica que el campo de número de celular esté enfocado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el enfoque.
   */
  public async expectCredentialsPhoneFocused(): Promise<void> {
    await expect(this.credentialsPhoneInput).toBeFocused();
  }

  /**
   * Verifica que el botón de iniciar sesión esté habilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectCredentialsSignInButtonEnabled(): Promise<void> {
    await expect(this.credentialsSignInButton).toBeEnabled();
  }

  /**
   * Verifica que el botón de registrarse en la sección de acceso alternativo esté habilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectAlternativeAccessRegisterButtonEnabled(): Promise<void> {
    await expect(this.alternativeAccessRegisterButton).toBeEnabled();
  }

  /**
   * Verifica que el botón de ingresar como invitado esté habilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectAlternativeAccessGuestButtonEnabled(): Promise<void> {
    await expect(this.alternativeAccessGuestButton).toBeEnabled();
  }

  /**
   * Verifica que el botón de iniciar sesión esté deshabilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectCredentialsSignInButtonDisabled(): Promise<void> {
    await expect(this.credentialsSignInButton).toBeDisabled();
  }

  /**
   * Verifica que el mensaje de error de número de celular esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneValue(
    expectedValue: string
  ): Promise<void> {
    await expect(this.credentialsPhoneInput).toHaveValue(expectedValue);
  }

  /**
   * Métodos para verificar visibilidad de mensajes de error.
   */

  /**
   * Verifica que el mensaje de error general del teléfono esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneErrorMessageVisible(): Promise<void> {
    await expect(this.credentialsPhoneErrorMessage).toBeVisible();
  }

  /**
   * Verifica que el mensaje de error general del teléfono no esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneErrorMessageHidden(): Promise<void> {
    await expect(this.credentialsPhoneErrorMessage).toBeHidden();
  }

  /**
   * Verifica que el mensaje de error de campo requerido esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneRequiredMessageVisible(): Promise<void> {
    await expect(this.credentialsPhoneRequiredMessage).toBeVisible();
  }

  /**
   * Verifica que el mensaje de error de campo requerido no esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneRequiredMessageHidden(): Promise<void> {
    await expect(this.credentialsPhoneRequiredMessage).toBeHidden();
  }

  /**
   * Verifica que el mensaje de error de longitud mínima esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneMinLengthMessageVisible(): Promise<void> {
    await expect(this.credentialsPhoneMinLengthMessage).toBeVisible();
  }

  /**
   * Verifica que el mensaje de error de longitud mínima no esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectCredentialsPhoneMinLengthMessageHidden(): Promise<void> {
    await expect(this.credentialsPhoneMinLengthMessage).toBeHidden();
  }

  /**
   * Métodos para verificar el contenido exacto de mensajes de error con toHaveText().
   */

  /**
   * Verifica que el mensaje de error general contenga el texto exacto esperado.
   * @param expectedText El texto exacto esperado en el mensaje de error.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectCredentialsPhoneErrorMessageToHaveText(
    expectedText: string
  ): Promise<void> {
    await expect(this.credentialsPhoneErrorMessage).toHaveText(expectedText);
  }

  /**
   * Verifica que el mensaje de error de campo requerido contenga el texto exacto esperado.
   * @param expectedText El texto exacto esperado en el mensaje de error.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectCredentialsPhoneRequiredMessageToHaveText(
    expectedText: string
  ): Promise<void> {
    await expect(this.credentialsPhoneRequiredMessage).toHaveText(expectedText);
  }

  /**
   * Verifica que el mensaje de error de longitud mínima contenga el texto exacto esperado.
   * @param expectedText El texto exacto esperado en el mensaje de error.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectCredentialsPhoneMinLengthMessageToHaveText(
    expectedText: string
  ): Promise<void> {
    await expect(this.credentialsPhoneMinLengthMessage).toHaveText(
      expectedText
    );
  }

  /**
   * Métodos para verificar contenido parcial de mensajes de error con toContainText().
   */

  /**
   * Verifica que el mensaje de error general contenga parcialmente el texto esperado.
   * @param expectedText El texto que debe estar contenido en el mensaje de error.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectCredentialsPhoneErrorMessageToContainText(
    expectedText: string
  ): Promise<void> {
    await expect(this.credentialsPhoneErrorMessage).toContainText(expectedText);
  }

  /**
   * Verifica que el mensaje de error de campo requerido contenga parcialmente el texto esperado.
   * @param expectedText El texto que debe estar contenido en el mensaje de error.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectCredentialsPhoneRequiredMessageToContainText(
    expectedText: string
  ): Promise<void> {
    await expect(this.credentialsPhoneRequiredMessage).toContainText(
      expectedText
    );
  }

  /**
   * Verifica que el mensaje de error de longitud mínima contenga parcialmente el texto esperado.
   * @param expectedText El texto que debe estar contenido en el mensaje de error.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectCredentialsPhoneMinLengthMessageToContainText(
    expectedText: string
  ): Promise<void> {
    await expect(this.credentialsPhoneMinLengthMessage).toContainText(
      expectedText
    );
  }

  /**
   * Métodos para verificar que los mensajes de error NO estén visibles.
   */

  /**
   * Verifica que el mensaje de error general del teléfono NO esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mensaje no está visible.
   */
  public async expectCredentialsPhoneErrorMessageNotVisible(): Promise<void> {
    await expect(this.credentialsPhoneErrorMessage).not.toBeVisible();
  }

  /**
   * Verifica que el mensaje de error de campo requerido NO esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mensaje no está visible.
   */
  public async expectCredentialsPhoneRequiredMessageNotVisible(): Promise<void> {
    await expect(this.credentialsPhoneRequiredMessage).not.toBeVisible();
  }

  /**
   * Verifica que el mensaje de error de longitud mínima NO esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mensaje no está visible.
   */
  public async expectCredentialsPhoneMinLengthMessageNotVisible(): Promise<void> {
    await expect(this.credentialsPhoneMinLengthMessage).not.toBeVisible();
  }

  /**
   * Métodos para el popup "¿Cambiaste de número de celular?".
   */

  /**
   * Verifica que el encabezado del popup esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del encabezado.
   */
  public async expectChangePhonePopupHeadingVisible(): Promise<void> {
    await expect(this.changePhonePopupHeading).toBeVisible();
  }

  /**
   * Verifica que el mensaje del popup esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del mensaje.
   */
  public async expectChangePhonePopupMessageVisible(): Promise<void> {
    await expect(this.changePhonePopupMessage).toBeVisible();
  }

  /**
   * Verifica que el botón del popup esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad del botón.
   */
  public async expectChangePhonePopupButtonVisible(): Promise<void> {
    await expect(this.changePhonePopupButton).toBeVisible();
  }

  /**
   * Hace clic en el botón "Ir a Don Manuel" del popup.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickChangePhonePopupButton(): Promise<void> {
    await this.changePhonePopupButton.click();
  }

  /**
   * Verifica que el encabezado del popup contenga el texto exacto esperado.
   * @param expectedText El texto exacto esperado en el encabezado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectChangePhonePopupHeadingToHaveText(expectedText: string): Promise<void> {
    await expect(this.changePhonePopupHeading).toHaveText(expectedText);
  }
}
