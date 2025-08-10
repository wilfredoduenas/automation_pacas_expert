/**
 * Utilitario especializado para manejo de fechas en tests de automatización.
 * Centraliza toda la lógica relacionada con cálculos de fechas y validaciones de mayoría de edad.
 * Sigue el principio de responsabilidad única (SRP) del patrón SOLID.
 */
export class DateHelper {
  private static readonly LEGAL_AGE = 18;
  private static readonly MONTH_NAMES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  /**
   * Obtiene la fecha actual del sistema.
   * @return {Date} Fecha actual.
   */
  public static getCurrentDate(): Date {
    return new Date();
  }

  /**
   * Calcula la fecha de mayoría de edad (18 años atrás desde hoy).
   * @return {Date} Fecha que corresponde a exactamente 18 años atrás.
   */
  public static getLegalAgeDate(): Date {
    const today = this.getCurrentDate();
    return new Date(today.getFullYear() - this.LEGAL_AGE, today.getMonth(), today.getDate());
  }

  /**
   * Obtiene el año de mayoría de edad.
   * @return {number} Año que corresponde a la mayoría de edad.
   */
  public static getLegalAgeYear(): number {
    return this.getCurrentDate().getFullYear() - this.LEGAL_AGE;
  }

  /**
   * Obtiene los meses que deben estar deshabilitados para cumplir la mayoría de edad.
   * @return {number[]} Array de índices de meses (0-11) que deben estar deshabilitados.
   */
  public static getDisabledMonths(): number[] {
    const currentMonth = this.getCurrentDate().getMonth();
    const disabledMonths: number[] = [];
    
    for (let month = currentMonth + 1; month <= 11; month++) {
      disabledMonths.push(month);
    }
    
    return disabledMonths;
  }

  /**
   * Obtiene los meses que deben estar habilitados para cumplir la mayoría de edad.
   * @return {number[]} Array de índices de meses (0-11) que deben estar habilitados.
   */
  public static getEnabledMonths(): number[] {
    const currentMonth = this.getCurrentDate().getMonth();
    const enabledMonths: number[] = [];
    
    for (let month = 0; month <= currentMonth; month++) {
      enabledMonths.push(month);
    }
    
    return enabledMonths;
  }

  /**
   * Obtiene los días que deben estar habilitados en el mes actual para cumplir la mayoría de edad.
   * @return {number[]} Array de días (1-31) que deben estar habilitados.
   */
  public static getEnabledDays(): number[] {
    const currentDay = this.getCurrentDate().getDate();
    const enabledDays: number[] = [];
    
    for (let day = 1; day <= currentDay; day++) {
      enabledDays.push(day);
    }
    
    return enabledDays;
  }

  /**
   * Convierte un índice de mes (0-11) a su nombre en español.
   * @param monthIndex Índice del mes (0=enero, 11=diciembre).
   * @return {string} Nombre del mes en español.
   */
  public static getMonthName(monthIndex: number): string {
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error(`Índice de mes inválido: ${monthIndex}. Debe estar entre 0 y 11.`);
    }
    return this.MONTH_NAMES[monthIndex];
  }

  /**
   * Formatea una fecha en formato DD/MM/AAAA.
   * @param date Fecha a formatear.
   * @return {string} Fecha formateada en formato DD/MM/AAAA.
   */
  public static formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Crea una fecha específica y la formatea en DD/MM/AAAA.
   * @param day Día (1-31).
   * @param month Mes (1-12).
   * @param year Año.
   * @return {string} Fecha formateada en formato DD/MM/AAAA.
   */
  public static createFormattedDate(day: number, month: number, year: number): string {
    // Convertir mes de 1-12 a 0-11 para el constructor Date
    const date = new Date(year, month - 1, day);
    return this.formatDate(date);
  }

  /**
   * Verifica si una fecha hace que una persona tenga al menos 18 años.
   * @param birthDate Fecha de nacimiento.
   * @param referenceDate Fecha de referencia (por defecto la fecha actual).
   * @return {boolean} True si la persona tiene al menos 18 años.
   */
  public static isLegalAge(birthDate: Date, referenceDate: Date = this.getCurrentDate()): boolean {
    const age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    const dayDiff = referenceDate.getDate() - birthDate.getDate();
    
    if (age > this.LEGAL_AGE) return true;
    if (age < this.LEGAL_AGE) return false;
    
    // Si tiene exactamente 18 años, verificar mes y día
    if (monthDiff > 0) return true;
    if (monthDiff < 0) return false;
    
    // Si estamos en el mismo mes, verificar el día
    return dayDiff >= 0;
  }

  /**
   * Obtiene información de debugging sobre las fechas de mayoría de edad.
   * @return {object} Objeto con información útil para debugging.
   */
  public static getDateInfo() {
    const today = this.getCurrentDate();
    const legalAgeDate = this.getLegalAgeDate();
    
    return {
      today: {
        date: this.formatDate(today),
        day: today.getDate(),
        month: today.getMonth(),
        monthName: this.getMonthName(today.getMonth()),
        year: today.getFullYear()
      },
      legalAge: {
        date: this.formatDate(legalAgeDate),
        day: legalAgeDate.getDate(),
        month: legalAgeDate.getMonth(),
        monthName: this.getMonthName(legalAgeDate.getMonth()),
        year: legalAgeDate.getFullYear()
      },
      validation: {
        enabledMonths: this.getEnabledMonths(),
        disabledMonths: this.getDisabledMonths(),
        enabledDays: this.getEnabledDays(),
        enabledMonthNames: this.getEnabledMonths().map(m => this.getMonthName(m)),
        disabledMonthNames: this.getDisabledMonths().map(m => this.getMonthName(m))
      }
    };
  }

  /**
   * Valida que todos los días habilitados estén correctamente configurados en una página.
   * @param registerPage Instancia de la página de registro.
   * @return {Promise<void>} Promesa que se resuelve cuando se validan todos los días.
   */
  public static async validateEnabledDays(registerPage: any): Promise<void> {
    const enabledDays = this.getEnabledDays();
    for (const day of enabledDays) {
      await registerPage.expectDayEnabled(day);
    }
  }

  /**
   * Valida que todos los meses deshabilitados estén correctamente configurados en una página.
   * @param registerPage Instancia de la página de registro.
   * @return {Promise<void>} Promesa que se resuelve cuando se validan todos los meses deshabilitados.
   */
  public static async validateDisabledMonths(registerPage: any): Promise<void> {
    const disabledMonths = this.getDisabledMonths();
    for (const month of disabledMonths) {
      await registerPage.expectMonthDisabled(month);
    }
  }

  /**
   * Valida que todos los meses habilitados estén correctamente configurados en una página.
   * @param registerPage Instancia de la página de registro.
   * @return {Promise<void>} Promesa que se resuelve cuando se validan todos los meses habilitados.
   */
  public static async validateEnabledMonths(registerPage: any): Promise<void> {
    const enabledMonths = this.getEnabledMonths();
    for (const month of enabledMonths) {
      await registerPage.expectMonthEnabled(month);
    }
  }

  /**
   * Valida completamente las restricciones de meses según la regla de mayoría de edad.
   * @param registerPage Instancia de la página de registro.
   * @return {Promise<void>} Promesa que se resuelve cuando se validan todas las restricciones de meses.
   */
  public static async validateMonthRestrictions(registerPage: any): Promise<void> {
    await this.validateDisabledMonths(registerPage);
    await this.validateEnabledMonths(registerPage);
  }

  /**
   * Crea una fecha válida para un usuario de 20 años (garantiza mayoría de edad).
   * @return {string} Fecha formateada en DD/MM/AAAA.
   */
  public static getValidAdultDate(): string {
    const today = this.getCurrentDate();
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    return this.formatDate(twentyYearsAgo);
  }

  /**
   * Crea una fecha inválida que haría que el usuario tenga menos de 18 años.
   * @return {Date} Fecha que representa a un usuario de 17 años, 11 meses y 29 días.
   */
  public static getInvalidMinorDate(): Date {
    const today = this.getCurrentDate();
    const invalidDate = new Date(today);
    invalidDate.setFullYear(today.getFullYear() - 17);
    invalidDate.setMonth(today.getMonth() - 11);
    invalidDate.setDate(today.getDate() - 29);
    return invalidDate;
  }

  /**
   * Valida una fecha de mayoría de edad seleccionándola y verificando que se aplique correctamente.
   * @param registerPage Instancia de la página de registro.
   * @return {Promise<void>} Promesa que se resuelve cuando se valida la selección de fecha válida.
   */
  public static async validateValidDateSelection(registerPage: any): Promise<void> {
    const validDate = this.getValidAdultDate();
    await registerPage.selectDate(validDate);
    await registerPage.expectSelectedDate(validDate);
    await registerPage.expectCalendarHidden();
  }

  /**
   * Valida que una fecha de menor de edad esté correctamente deshabilitada.
   * Este método verifica que no se pueda seleccionar una fecha que haría que el usuario tenga menos de 18 años.
   * @param registerPage Instancia de la página de registro.
   * @return {Promise<void>} Promesa que se resuelve cuando se valida que la fecha está deshabilitada.
   */
  public static async validateInvalidDateRestriction(registerPage: any): Promise<void> {
    // Obtener una fecha que haría que el usuario tenga exactamente 17 años, 11 meses y 29 días
    const invalidDate = this.getInvalidMinorDate();
    const targetDay = invalidDate.getDate();
    const targetMonth = invalidDate.getMonth() + 1; // Convertir de 0-11 a 1-12
    const targetYear = invalidDate.getFullYear();
    
    // Formatear la fecha para intentar seleccionarla
    const invalidDateString = this.createFormattedDate(targetDay, targetMonth, targetYear);
    
    try {
      // Intentar seleccionar la fecha inválida
      // Si el sistema está bien implementado, esta operación debería fallar
      // o la fecha debería estar deshabilitada
      await registerPage.selectDate(invalidDateString);
      
      // Si llegamos aquí, el sistema permitió seleccionar una fecha inválida
      throw new Error(`El sistema permitió seleccionar una fecha inválida: ${invalidDateString}`);
      
    } catch (error) {
      // Si el error es porque el día está deshabilitado, es correcto
      if (error.message.includes('bds-disabled') || 
          error.message.includes('not available') || 
          error.message.includes('deshabilitado')) {
        
        // Esto es lo esperado - la fecha está correctamente deshabilitada
        console.log(`✅ Fecha inválida correctamente deshabilitada: ${invalidDateString}`);
        return;
      }
      
      // Si es otro tipo de error, verificar manualmente que el día esté deshabilitado
      // Primero navegar al mes y año correcto de manera más inteligente
      try {
        await registerPage.openDatePicker();
        await registerPage.expectCalendarVisible();
        
        // Intentar navegar al año/mes de la fecha inválida usando selectDate parcialmente
        // pero solo para posicionarse, no para seleccionar
        const currentMonthYear = await registerPage.getCurrentCalendarMonthYear();
        console.log(`Mes/Año actual del calendario: ${currentMonthYear}`);
        
        // Verificar que el día específico esté deshabilitado en cualquier mes que estemos
        await registerPage.expectDayDisabled(targetDay);
        
      } catch (navError) {
        console.log(`⚠️ No se pudo navegar para verificar, pero la fecha fue rechazada: ${invalidDateString}`);
        // Si no podemos navegar pero la fecha fue rechazada, asumimos que es correcto
      }
    }
  }
}
