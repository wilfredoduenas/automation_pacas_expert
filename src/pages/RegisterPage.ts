import { Locator, Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { IRegisterPage } from "../interfaces/IRegisterPage";

/**
 * Page Object Model para la página de registro, centraliza locators y lógica de verificación.
 * Permite fácil extensión y mantenimiento.
 */
export class RegisterPage extends BasePage implements IRegisterPage {
  /**
   * Variables de la sección de progreso.
   */
  private readonly progressStepText: Locator;
  private readonly progressImage: Locator;
  private readonly progressTitle: Locator;

  /**
   * Variables de la sección de datos personales.
   */
  private readonly backgroundImage: Locator;
  private readonly logoImage: Locator;
  private readonly firstNameLabel: Locator;
  private readonly firstNameInput: Locator;
  private readonly paternalLastNameLabel: Locator;
  private readonly paternalLastNameInput: Locator;
  private readonly maternalLastNameLabel: Locator;
  private readonly maternalLastNameInput: Locator;
  private readonly birthDateLabel: Locator;
  private readonly birthDateButton: Locator;
  private readonly backgroundContainer: Locator;

  /**
   * Variables de la sección de tipo de documento.
   */
  private readonly documentTypeLabel: Locator;
  private readonly dniRadioSpan: Locator;
  private readonly dniLabel: Locator;
  private readonly foreignerCardRadioSpan: Locator;
  private readonly foreignerCardLabel: Locator;
  private readonly documentNumberLabel: Locator;
  private readonly documentNumberInput: Locator;

  /**
   * Variables de la sección de navegación.
   */
  private readonly backButton: Locator;
  private readonly nextButton: Locator;

  /**
   * Elementos de la sección de progreso.
   */
  private progressLocators = [
    () => this.progressStepText,
    () => this.progressImage,
    () => this.progressTitle,
  ];

  /**
   * Elementos de la sección de datos personales.
   */
  private personalDataLocators = [
    () => this.backgroundImage,
    () => this.logoImage,
    () => this.firstNameLabel,
    () => this.firstNameInput,
    () => this.paternalLastNameLabel,
    () => this.paternalLastNameInput,
    () => this.maternalLastNameLabel,
    () => this.maternalLastNameInput,
    () => this.birthDateLabel,
    () => this.birthDateButton,
    () => this.backgroundContainer,
  ];

  /**
   * Elementos de la sección de tipo de documento.
   */
  private documentTypeLocators = [
    () => this.documentTypeLabel,
    () => this.dniRadioSpan,
    () => this.dniLabel,
    () => this.foreignerCardRadioSpan,
    () => this.foreignerCardLabel,
    () => this.documentNumberLabel,
    () => this.documentNumberInput,
  ];

  /**
   * Elementos de la sección de navegación.
   */
  private navigationLocators = [
    () => this.backButton,
    () => this.nextButton,
  ];

  /**
   * Constructor for the RegisterPage class.
   * @param page The Playwright page object.
   */
  constructor(page: Page) {
    super(page);

    /**
     * Elementos de la sección de progreso.
     */
    this.progressStepText = this.page.getByText("Paso 1/");
    this.progressImage = this.page.getByRole("img", { name: "p-progress-" });
    this.progressTitle = this.page.getByText("Registra tus datos personales");

    /**
     * Elementos de la sección de datos personales.
     */
    this.backgroundImage = this.page
      .getByRole("dialog")
      .getByRole("img", { name: "bg-auth" });
    this.logoImage = this.page.getByRole("img", { name: "logo-cxp" });
    this.firstNameLabel = this.page.getByText("Nombres");
    this.firstNameInput = this.page.getByRole("textbox", { name: "Nombres" });
    this.paternalLastNameLabel = this.page.getByText("Apellido paterno");
    this.paternalLastNameInput = this.page.getByRole("textbox", {
      name: "Apellido paterno",
    });
    this.maternalLastNameLabel = this.page.getByText("Apellido materno");
    this.maternalLastNameInput = this.page.getByRole("textbox", {
      name: "Apellido materno",
    });
    this.birthDateLabel = this.page.getByText("Fecha de nacimiento");
    this.birthDateButton = this.page.getByRole("button", {
      name: "dd/mm/aaaa calendar_today",
    });
    this.backgroundContainer = this.page.locator(".container-register__img__bg");

    /**
     * Elementos de la sección de tipo de documento.
     */
    this.documentTypeLabel = this.page.getByText("Tipo de documento");
    this.dniRadioSpan = this.page
      .locator("label")
      .filter({ hasText: "DNI" })
      .locator("span")
      .nth(1);
    this.dniLabel = this.page.getByText("DNI");
    this.foreignerCardRadioSpan = this.page
      .locator("label")
      .filter({ hasText: "Carnet de extranjería" })
      .locator("span")
      .nth(1);
    this.foreignerCardLabel = this.page.getByText("Carnet de extranjería");
    this.documentNumberLabel = this.page.getByText("N° de documento");
    this.documentNumberInput = this.page.getByRole("textbox", {
      name: "N° de documento",
    });

    /**
     * Elementos de la sección de navegación.
     */
    this.backButton = this.page.getByRole("button", { name: "arrow_back Atrás" });
    this.nextButton = this.page.getByRole("button", {
      name: "Siguiente",
      exact: true,
    });
  }

  /**
   * Verifica la visibilidad de los elementos de la sección de progreso.
   */
  public async verifyProgressElements(): Promise<void> {
    await this.verifySection(this.progressLocators, "Progress Section");
  }

  /**
   * Verifica la visibilidad de los elementos de la sección de datos personales.
   */
  public async verifyPersonalDataElements(): Promise<void> {
    await this.verifySection(this.personalDataLocators, "Personal Data Section");
  }

  /**
   * Verifica la visibilidad de los elementos de la sección de tipo de documento.
   */
  public async verifyDocumentTypeElements(): Promise<void> {
    await this.verifySection(this.documentTypeLocators, "Document Type Section");
  }

  /**
   * Verifica la visibilidad de los elementos de la sección de navegación.
   */
  public async verifyNavigationElements(): Promise<void> {
    await this.verifySection(this.navigationLocators, "Navigation Section");
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
   * Métodos para interactuar con los campos de datos personales.
   */

  /**
   * Rellena el campo de nombres con el valor proporcionado.
   * @param firstName El nombre a ingresar.
   */
  public async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Rellena el campo de apellido paterno con el valor proporcionado.
   * @param paternalLastName El apellido paterno a ingresar.
   */
  public async fillPaternalLastName(paternalLastName: string): Promise<void> {
    await this.paternalLastNameInput.fill(paternalLastName);
  }

  /**
   * Rellena el campo de apellido materno con el valor proporcionado.
   * @param maternalLastName El apellido materno a ingresar.
   */
  public async fillMaternalLastName(maternalLastName: string): Promise<void> {
    await this.maternalLastNameInput.fill(maternalLastName);
  }

  /**
   * Rellena el campo de número de documento con el valor proporcionado.
   * @param documentNumber El número de documento a ingresar.
   */
  public async fillDocumentNumber(documentNumber: string): Promise<void> {
    await this.documentNumberInput.fill(documentNumber);
  }

  /**
   * Hace clic en el botón de fecha de nacimiento.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickBirthDateButton(): Promise<void> {
    await this.birthDateButton.click();
  }

  /**
   * Hace clic en la opción DNI.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en la opción.
   */
  public async clickDniOption(): Promise<void> {
    await this.dniRadioSpan.click();
  }

  /**
   * Hace clic en la opción Carnet de extranjería.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en la opción.
   */
  public async clickForeignerCardOption(): Promise<void> {
    await this.foreignerCardRadioSpan.click();
  }

  /**
   * Hace clic en el botón Atrás.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickBackButton(): Promise<void> {
    await this.backButton.click();
  }

  /**
   * Hace clic en el botón Siguiente.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickNextButton(): Promise<void> {
    await this.nextButton.click();
  }

  /**
   * Métodos para verificar valores de campos.
   */

  /**
   * Obtiene el valor del campo de nombres.
   * @returns El valor del campo de nombres.
   */
  public async getFirstNameValue(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  /**
   * Obtiene el valor del campo de apellido paterno.
   * @returns El valor del campo de apellido paterno.
   */
  public async getPaternalLastNameValue(): Promise<string> {
    return await this.paternalLastNameInput.inputValue();
  }

  /**
   * Obtiene el valor del campo de apellido materno.
   * @returns El valor del campo de apellido materno.
   */
  public async getMaternalLastNameValue(): Promise<string> {
    return await this.maternalLastNameInput.inputValue();
  }

  /**
   * Obtiene el valor del campo de número de documento.
   * @returns El valor del campo de número de documento.
   */
  public async getDocumentNumberValue(): Promise<string> {
    return await this.documentNumberInput.inputValue();
  }

  /**
   * Métodos para verificar estados de elementos.
   */

  /**
   * Verifica que el botón Siguiente esté habilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectNextButtonEnabled(): Promise<void> {
    await expect(this.nextButton).toBeEnabled();
  }

  /**
   * Verifica que el botón Siguiente esté deshabilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectNextButtonDisabled(): Promise<void> {
    await expect(this.nextButton).toBeDisabled();
  }

  /**
   * Verifica que el botón Atrás esté habilitado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el estado del botón.
   */
  public async expectBackButtonEnabled(): Promise<void> {
    await expect(this.backButton).toBeEnabled();
  }

  /**
   * Verifica que el campo de nombres esté enfocado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el enfoque.
   */
  public async expectFirstNameFocused(): Promise<void> {
    await expect(this.firstNameInput).toBeFocused();
  }

  /**
   * Métodos para verificar texto específico.
   */

  /**
   * Verifica que el texto del paso contenga el texto exacto esperado.
   * @param expectedText El texto exacto esperado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectProgressStepToHaveText(expectedText: string): Promise<void> {
    await expect(this.progressStepText).toHaveText(expectedText);
  }

  /**
   * Verifica que el título del progreso contenga el texto exacto esperado.
   * @param expectedText El texto exacto esperado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el texto.
   */
  public async expectProgressTitleToHaveText(expectedText: string): Promise<void> {
    await expect(this.progressTitle).toHaveText(expectedText);
  }

  /**
   * Verifica que un campo tenga el valor esperado.
   * @param expectedValue El valor esperado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el valor.
   */
  public async expectFirstNameValue(expectedValue: string): Promise<void> {
    await expect(this.firstNameInput).toHaveValue(expectedValue);
  }

  /**
   * Verifica que el campo apellido paterno tenga el valor esperado.
   * @param expectedValue El valor esperado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el valor.
   */
  public async expectPaternalLastNameValue(expectedValue: string): Promise<void> {
    await expect(this.paternalLastNameInput).toHaveValue(expectedValue);
  }

  /**
   * Verifica que el campo apellido materno tenga el valor esperado.
   * @param expectedValue El valor esperado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el valor.
   */
  public async expectMaternalLastNameValue(expectedValue: string): Promise<void> {
    await expect(this.maternalLastNameInput).toHaveValue(expectedValue);
  }

  /**
   * Verifica que el campo número de documento tenga el valor esperado.
   * @param expectedValue El valor esperado.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el valor.
   */
  public async expectDocumentNumberValue(expectedValue: string): Promise<void> {
    await expect(this.documentNumberInput).toHaveValue(expectedValue);
  }
}