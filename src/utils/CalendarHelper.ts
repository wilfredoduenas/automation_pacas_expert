import { Locator, Page, expect } from "@playwright/test";

/**
 * Helper especializado para interacciones complejas con el calendario/datepicker.
 * Centraliza toda la lógica de navegación y selección de fechas, separando 
 * la lógica de negocio de las interacciones con UI.
 */
export class CalendarHelper {
  /**
   * Valida que una fecha tenga el formato correcto DD/MM/AAAA.
   * @param dateString Fecha a validar.
   * @return {object} Objeto con día, mes, año parseados o error.
   */
  public static validateAndParseDate(dateString: string): { day: number; month: number; year: number } {
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      throw new Error("Formato de fecha inválido. Use DD/MM/AAAA");
    }

    const [, day, month, year] = match;
    return {
      day: parseInt(day, 10),
      month: parseInt(month, 10),
      year: parseInt(year, 10)
    };
  }

  /**
   * Obtiene los nombres de meses en español.
   * @return {string[]} Array con nombres de meses.
   */
  public static getMonthNames(): string[] {
    return [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
  }

  /**
   * Determina la dirección de navegación necesaria para llegar a un mes/año objetivo.
   * @param currentDateText Texto actual del calendario.
   * @param targetMonth Mes objetivo (1-12).
   * @param targetYear Año objetivo.
   * @return {string} "previous", "next" o "target" si ya está en el objetivo.
   */
  public static getNavigationDirection(
    currentDateText: string | null, 
    targetMonth: number, 
    targetYear: number
  ): "previous" | "next" | "target" {
    const monthNames = this.getMonthNames();
    const targetMonthName = monthNames[targetMonth - 1];
    
    if (currentDateText?.includes(`${targetMonthName} ${targetYear}`)) {
      return "target";
    }

    // Extraer año actual del texto
    const currentYearMatch = currentDateText?.match(/(\d{4})/);
    const currentYear = currentYearMatch ? parseInt(currentYearMatch[1], 10) : new Date().getFullYear();
    
    // Encontrar el mes actual
    const currentMonthIndex = monthNames.findIndex(m => currentDateText?.includes(m));
    const currentMonth = currentMonthIndex + 1;

    // Decidir dirección de navegación
    if (targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth)) {
      return "previous";
    } else {
      return "next";
    }
  }

  /**
   * Ejecuta la navegación completa hacia un mes/año objetivo.
   * @param page Instancia de la página.
   * @param calendarCurrentDate Locator del texto de fecha actual.
   * @param navigateToPrevious Función para navegar al mes anterior.
   * @param navigateToNext Función para navegar al mes siguiente.
   * @param targetMonth Mes objetivo (1-12).
   * @param targetYear Año objetivo.
   * @param maxAttempts Número máximo de intentos de navegación.
   * @return {Promise<void>} Promesa que se resuelve cuando se alcanza el objetivo.
   */
  public static async navigateToTargetMonth(
    page: Page,
    calendarCurrentDate: Locator,
    navigateToPrevious: () => Promise<void>,
    navigateToNext: () => Promise<void>,
    targetMonth: number,
    targetYear: number,
    maxAttempts: number = 100
  ): Promise<void> {
    const monthNames = this.getMonthNames();
    const targetMonthName = monthNames[targetMonth - 1];
    
    let attempts = 0;

    while (attempts < maxAttempts) {
      const currentDateText = await calendarCurrentDate.textContent();
      const direction = this.getNavigationDirection(currentDateText, targetMonth, targetYear);
      
      if (direction === "target") {
        break;
      }

      if (direction === "previous") {
        await navigateToPrevious();
      } else {
        await navigateToNext();
      }

      attempts++;
      await page.waitForTimeout(100); // Pequeña pausa para evitar clicks muy rápidos
    }

    if (attempts >= maxAttempts) {
      throw new Error(`No se pudo navegar al mes ${targetMonthName} ${targetYear} después de ${maxAttempts} intentos`);
    }
  }

  /**
   * Selecciona una fecha completa usando los componentes del calendario.
   * @param page Instancia de la página.
   * @param calendarDropdown Locator del dropdown del calendario.
   * @param calendarCurrentDate Locator del texto de fecha actual.
   * @param calendarDays Locator del contenedor de días.
   * @param openDatePicker Función para abrir el calendario.
   * @param navigateToPrevious Función para navegar al mes anterior.
   * @param navigateToNext Función para navegar al mes siguiente.
   * @param targetDate Fecha objetivo en formato "DD/MM/AAAA".
   * @return {Promise<void>} Promesa que se resuelve cuando se selecciona la fecha.
   */
  public static async selectDate(
    page: Page,
    calendarDropdown: Locator,
    calendarCurrentDate: Locator,
    calendarDays: Locator,
    openDatePicker: () => Promise<void>,
    navigateToPrevious: () => Promise<void>,
    navigateToNext: () => Promise<void>,
    targetDate: string
  ): Promise<void> {
    // Validar y parsear fecha
    const { day, month, year } = this.validateAndParseDate(targetDate);

    // Abrir el calendario si no está abierto
    const isCalendarVisible = await calendarDropdown.isVisible();
    if (!isCalendarVisible) {
      await openDatePicker();
    }

    // Navegar al año y mes correcto
    await this.navigateToTargetMonth(
      page,
      calendarCurrentDate,
      navigateToPrevious,
      navigateToNext,
      month,
      year
    );

    // Seleccionar el día
    await this.selectDay(calendarDays, day);

    // Esperar a que el calendario se cierre automáticamente
    await expect(calendarDropdown).toBeHidden({ timeout: 5000 });
  }

  /**
   * Selecciona un día específico del calendario.
   * @param calendarDays Locator del contenedor de días.
   * @param day El día a seleccionar (1-31).
   * @return {Promise<void>} Promesa que se resuelve cuando se selecciona el día.
   */
  public static async selectDay(calendarDays: Locator, day: number): Promise<void> {
    if (day < 1 || day > 31) {
      throw new Error("El día debe estar entre 1 y 31");
    }
    
    // Usar un selector más específico para evitar coincidencias parciales
    // Buscar elementos li que tengan exactamente el texto del día
    const dayLocator = calendarDays.locator(`li`).filter({
      hasText: new RegExp(`^${day}$`)
    }).and(calendarDays.locator(`li:not(.bds-disabled)`));
    
    await expect(dayLocator).toBeVisible({ timeout: 5000 });
    await dayLocator.click();
  }

  /**
   * Verifica que un día específico esté habilitado en el calendario.
   * @param calendarDays Locator del contenedor de días.
   * @param day Día a verificar (1-31).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el día está habilitado.
   */
  public static async expectDayEnabled(calendarDays: Locator, day: number): Promise<void> {
    // Usar un selector más específico para evitar coincidencias parciales
    const dayLocator = calendarDays.locator(`li`).filter({
      hasText: new RegExp(`^${day}$`)
    }).and(calendarDays.locator(`li:not(.bds-disabled)`));
    
    await expect(dayLocator).toBeVisible();
  }

  /**
   * Verifica que un día específico esté deshabilitado en el calendario.
   * @param calendarDays Locator del contenedor de días.
   * @param day Día a verificar (1-31).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el día está deshabilitado.
   */
  public static async expectDayDisabled(calendarDays: Locator, day: number): Promise<void> {
    // Usar un selector más específico para evitar coincidencias parciales
    const dayLocator = calendarDays.locator(`li`).filter({
      hasText: new RegExp(`^${day}$`)
    }).and(calendarDays.locator(`li.bds-disabled`));
    
    await expect(dayLocator).toBeVisible();
  }

  /**
   * Verifica que un mes específico esté habilitado en el selector de meses.
   * @param page Instancia de la página.
   * @param month Índice del mes a verificar (0-11, donde 0=enero, 11=diciembre).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mes está habilitado.
   */
  public static async expectMonthEnabled(page: Page, month: number): Promise<void> {
    const monthSelector = page.locator(`[data-month="${month}"]:not(.disabled), [data-testid="month-${month}"]:not(.disabled)`);
    await expect(monthSelector).toBeVisible();
  }

  /**
   * Verifica que un mes específico esté deshabilitado en el selector de meses.
   * @param page Instancia de la página.
   * @param month Índice del mes a verificar (0-11, donde 0=enero, 11=diciembre).
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que el mes está deshabilitado.
   */
  public static async expectMonthDisabled(page: Page, month: number): Promise<void> {
    const monthSelector = page.locator(`[data-month="${month}"].disabled, [data-testid="month-${month}"].disabled`);
    await expect(monthSelector).toBeVisible();
  }

  /**
   * Verifica que el calendario esté visible.
   * @param calendarDropdown Locator del dropdown del calendario.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la visibilidad.
   */
  public static async expectCalendarVisible(calendarDropdown: Locator): Promise<void> {
    await expect(calendarDropdown).toBeVisible();
  }

  /**
   * Verifica que el calendario esté oculto.
   * @param calendarDropdown Locator del dropdown del calendario.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica que está oculto.
   */
  public static async expectCalendarHidden(calendarDropdown: Locator): Promise<void> {
    await expect(calendarDropdown).toBeHidden();
  }

  /**
   * Verifica que la fecha mostrada en el input sea la esperada.
   * @param datepickerInput Locator del input del datepicker.
   * @param expectedDate Fecha esperada en formato DD/MM/AAAA.
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica la fecha.
   */
  public static async expectSelectedDate(datepickerInput: Locator, expectedDate: string): Promise<void> {
    const dateLabel = datepickerInput.locator("label");
    await expect(dateLabel).toHaveText(expectedDate);
  }

  /**
   * Verifica que el mes y año mostrados en el calendario sean los esperados.
   * @param calendarCurrentDate Locator del texto de fecha actual.
   * @param expectedMonthYear Mes y año esperados (ej: "Agosto 2007").
   * @return {Promise<void>} Promesa que se resuelve cuando se verifica el mes/año.
   */
  public static async expectCalendarMonthYear(calendarCurrentDate: Locator, expectedMonthYear: string): Promise<void> {
    await expect(calendarCurrentDate).toHaveText(expectedMonthYear);
  }

  /**
   * Obtiene la fecha actualmente seleccionada en el input.
   * @param datepickerInput Locator del input del datepicker.
   * @return {Promise<string>} La fecha seleccionada en formato DD/MM/AAAA.
   */
  public static async getSelectedDate(datepickerInput: Locator): Promise<string> {
    const dateLabel = datepickerInput.locator("label");
    return await dateLabel.textContent() || "";
  }

  /**
   * Obtiene el mes y año actualmente mostrados en el calendario.
   * @param calendarCurrentDate Locator del texto de fecha actual.
   * @return {Promise<string>} El mes y año en formato "Mes AAAA".
   */
  public static async getCurrentCalendarMonthYear(calendarCurrentDate: Locator): Promise<string> {
    return await calendarCurrentDate.textContent() || "";
  }
}
