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
}
