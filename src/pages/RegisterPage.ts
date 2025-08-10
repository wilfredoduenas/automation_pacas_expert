import { Locator, Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ICompleteRegisterPage } from "../interfaces/IRegisterPage";
import { CalendarHelper } from "../utils/CalendarHelper";

/**
 * Page Object Model para la página de registro, centraliza locators y lógica de verificación.
 * Permite fácil extensión y mantenimiento.
 */
export class RegisterPage extends BasePage implements ICompleteRegisterPage {
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
   * Variables del calendario de fecha de nacimiento.
   */
  private readonly datepickerContainer: Locator;
  private readonly datepickerInput: Locator;
  private readonly datepickerCalendarIcon: Locator;
  private readonly datepickerCloseIcon: Locator;
  private readonly calendarDropdown: Locator;
  private readonly calendarContainer: Locator;
  private readonly calendarHeader: Locator;
  private readonly calendarCurrentDate: Locator;
  private readonly calendarArrowUp: Locator;
  private readonly calendarArrowLeft: Locator;
  private readonly calendarArrowRight: Locator;
  private readonly calendarDaysContainer: Locator;
  private readonly calendarWeeks: Locator;
  private readonly calendarDays: Locator;

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
     * Elementos del calendario de fecha de nacimiento.
     */
    this.datepickerContainer = this.page.locator(".bds-datepicker");
    this.datepickerInput = this.page.locator(".bds-input-wrapper.construyex.md.bds-deletable");
    this.datepickerCalendarIcon = this.page.locator(".material-icons-round.bds-calendar");
    this.datepickerCloseIcon = this.page.locator(".bds-close .material-icons-round");
    this.calendarDropdown = this.page.locator(".construyex.bds-dropdown-calendar");
    this.calendarContainer = this.page.locator("bds-calendar.construyex.bds-calendar-container");
    this.calendarHeader = this.page.locator(".bds-header");
    this.calendarCurrentDate = this.page.locator(".bds-current-date p");
    this.calendarArrowUp = this.page.locator(".bds-current-date i");
    this.calendarArrowLeft = this.page.locator(".bds-arrows i").first();
    this.calendarArrowRight = this.page.locator(".bds-arrows i").last();
    this.calendarDaysContainer = this.page.locator(".bds-calendar-days");
    this.calendarWeeks = this.page.locator(".bds-weeks");
    this.calendarDays = this.page.locator(".bds-days");

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
   * Llena ambos apellidos (paterno y materno) - método de conveniencia.
   * @param lastName El apellido completo a escribir (se usará para ambos campos).
   * @return {Promise<void>} Promesa que se resuelve cuando se llenan los campos.
   */
  public async fillLastName(lastName: string): Promise<void> {
    await this.fillPaternalLastName(lastName);
    await this.fillMaternalLastName(lastName);
  }

  /**
   * Hace clic en el botón de fecha de nacimiento para abrir el calendario.
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en el botón.
   */
  public async clickBirthDateButton(): Promise<void> {
    await this.birthDateButton.click();
  }

  /**
   * Abre el calendario de fecha de nacimiento.
   * @return {Promise<void>} Promesa que se resuelve cuando se abre el calendario.
   */
  public async openDatePicker(): Promise<void> {
    await this.datepickerCalendarIcon.click();
    // Esperar a que el calendario sea visible
    await expect(this.calendarDropdown).toBeVisible({ timeout: 5000 });
  }

  /**
   * Cierra el calendario de fecha de nacimiento usando múltiples estrategias.
   * @return {Promise<void>} Promesa que se resuelve cuando se cierra el calendario.
   */
  public async closeDatePicker(): Promise<void> {
    // Verificar si el calendario está abierto antes de intentar cerrarlo
    const isCalendarVisible = await this.calendarDropdown.isVisible();
    if (!isCalendarVisible) {
      console.log("El calendario ya está cerrado");
      return;
    }

    // Estrategia 1: Intentar usar el icono de cerrar si está visible
    try {
      const closeIcon = this.datepickerCloseIcon;
      if (await closeIcon.isVisible({ timeout: 1000 })) {
        await closeIcon.click();
        await expect(this.calendarDropdown).toBeHidden({ timeout: 3000 });
        return;
      }
    } catch (error) {
      console.log("Estrategia 1 (icono cerrar) falló, probando estrategia 2");
    }

    // Estrategia 2: Hacer clic en el icono del calendario para cerrarlo
    try {
      await this.datepickerCalendarIcon.click();
      await expect(this.calendarDropdown).toBeHidden({ timeout: 3000 });
      return;
    } catch (error) {
      console.log("Estrategia 2 (icono calendario) falló, probando estrategia 3");
    }

    // Estrategia 3: Hacer clic en el input de fecha para cerrarlo
    try {
      await this.datepickerInput.click();
      await expect(this.calendarDropdown).toBeHidden({ timeout: 3000 });
      return;
    } catch (error) {
      console.log("Estrategia 3 (input fecha) falló, probando estrategia 4");
    }

    // Estrategia 4: Hacer clic fuera del calendario (en el fondo)
    try {
      await this.backgroundContainer.click();
      await expect(this.calendarDropdown).toBeHidden({ timeout: 3000 });
      return;
    } catch (error) {
      console.log("Estrategia 4 (clic fuera) falló, probando estrategia 5");
    }

    // Estrategia 5: Presionar la tecla Escape
    try {
      await this.page.keyboard.press('Escape');
      await expect(this.calendarDropdown).toBeHidden({ timeout: 3000 });
      return;
    } catch (error) {
      console.log("Estrategia 5 (Escape) falló");
    }

    // Si todas las estrategias fallan, lanzar error
    throw new Error("No se pudo cerrar el calendario con ninguna de las estrategias disponibles");
  }

  /**
   * Navega al mes anterior en el calendario.
   * @return {Promise<void>} Promesa que se resuelve cuando se navega al mes anterior.
   */
  public async navigateToPreviousMonth(): Promise<void> {
    await this.calendarArrowLeft.click();
  }

  /**
   * Navega al mes siguiente en el calendario.
   * @return {Promise<void>} Promesa que se resuelve cuando se navega al mes siguiente.
   */
  public async navigateToNextMonth(): Promise<void> {
    await this.calendarArrowRight.click();
  }

  /**
   * Hace clic en la fecha actual para cambiar de vista (mes/año).
   * @return {Promise<void>} Promesa que se resuelve cuando se hace clic en la fecha actual.
   */
  public async clickCurrentDateHeader(): Promise<void> {
    await this.calendarArrowUp.click();
  }

  /**
   * Selecciona un día específico del calendario.
   * @param day El día a seleccionar (1-31).
   * @return {Promise<void>} Promesa que se resuelve cuando se selecciona el día.
   */
  public async selectDay(day: number): Promise<void> {
    await CalendarHelper.selectDay(this.calendarDays, day);
  }

  /**
   * Selecciona una fecha completa navegando por mes y año si es necesario.
   * @param targetDate Fecha objetivo en formato "DD/MM/AAAA".
   * @return {Promise<void>} Promesa que se resuelve cuando se selecciona la fecha.
   */
  public async selectDate(targetDate: string): Promise<void> {
    await CalendarHelper.selectDate(
      this.page,
      this.calendarDropdown,
      this.calendarCurrentDate,
      this.calendarDays,
      () => this.openDatePicker(),
      () => this.navigateToPreviousMonth(),
      () => this.navigateToNextMonth(),
      targetDate
    );
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

  /**
   * Métodos para verificar estados del datepicker.
   */

  /**
   * Verifica que el calendario esté visible.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad.
   */
  public async expectCalendarVisible(): Promise<void> {
    await CalendarHelper.expectCalendarVisible(this.calendarDropdown);
  }

  /**
   * Verifica que el calendario esté oculto.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que está oculto.
   */
  public async expectCalendarHidden(): Promise<void> {
    await CalendarHelper.expectCalendarHidden(this.calendarDropdown);
  }

  /**
   * Verifica que la fecha mostrada en el input sea la esperada.
   * @param expectedDate Fecha esperada en formato DD/MM/AAAA.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la fecha.
   */
  public async expectSelectedDate(expectedDate: string): Promise<void> {
    await CalendarHelper.expectSelectedDate(this.datepickerInput, expectedDate);
  }

  /**
   * Verifica que el mes y año mostrados en el calendario sean los esperados.
   * @param expectedMonthYear Mes y año esperados (ej: "Agosto 2007").
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el mes/año.
   */
  public async expectCalendarMonthYear(expectedMonthYear: string): Promise<void> {
    await CalendarHelper.expectCalendarMonthYear(this.calendarCurrentDate, expectedMonthYear);
  }

  /**
   * Verifica que un día específico esté habilitado en el calendario.
   * @param day Día a verificar (1-31).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el día está habilitado.
   */
  public async expectDayEnabled(day: number): Promise<void> {
    await CalendarHelper.expectDayEnabled(this.calendarDays, day);
  }

  /**
   * Verifica que un día específico esté deshabilitado en el calendario.
   * @param day Día a verificar (1-31).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el día está deshabilitado.
   */
  public async expectDayDisabled(day: number): Promise<void> {
    await CalendarHelper.expectDayDisabled(this.calendarDays, day);
  }

  /**
   * Obtiene la fecha actualmente seleccionada en el input.
   * @return {Promise<string>} La fecha seleccionada en formato DD/MM/AAAA.
   */
  public async getSelectedDate(): Promise<string> {
    return await CalendarHelper.getSelectedDate(this.datepickerInput);
  }

  /**
   * Obtiene el mes y año actualmente mostrados en el calendario.
   * @return {Promise<string>} El mes y año en formato "Mes AAAA".
   */
  public async getCurrentCalendarMonthYear(): Promise<string> {
    return await CalendarHelper.getCurrentCalendarMonthYear(this.calendarCurrentDate);
  }

  /**
   * Verifica que un mes específico esté habilitado en el selector de meses.
   * @param month Índice del mes a verificar (0-11, donde 0=enero, 11=diciembre).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mes está habilitado.
   */
  public async expectMonthEnabled(month: number): Promise<void> {
    await CalendarHelper.expectMonthEnabled(this.page, month);
  }

  /**
   * Verifica que un mes específico esté deshabilitado en el selector de meses.
   * @param month Índice del mes a verificar (0-11, donde 0=enero, 11=diciembre).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mes está deshabilitado.
   */
  public async expectMonthDisabled(month: number): Promise<void> {
    await CalendarHelper.expectMonthDisabled(this.page, month);
  }
}