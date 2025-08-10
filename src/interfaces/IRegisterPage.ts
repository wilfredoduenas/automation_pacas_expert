/**
 * Interfaz base para validación de elementos de la página de registro.
 * Respeta el principio de segregación de interfaces (ISP).
 */
export interface IRegisterPage {
  verifyProgressElements(): Promise<void>;
  verifyPersonalDataElements(): Promise<void>;
  verifyDocumentTypeElements(): Promise<void>;
  verifyNavigationElements(): Promise<void>;
}

/**
 * Interfaz específica para operaciones de calendario/datepicker.
 * Separada para respetar el principio de segregación de interfaces (ISP).
 */
export interface ICalendarOperations {
  expectCalendarVisible(): Promise<void>;
  expectCalendarHidden(): Promise<void>;
  expectSelectedDate(expectedDate: string): Promise<void>;
  expectCalendarMonthYear(expectedMonthYear: string): Promise<void>;
  expectDayEnabled(day: number): Promise<void>;
  expectDayDisabled(day: number): Promise<void>;
  expectMonthEnabled(month: number): Promise<void>;
  expectMonthDisabled(month: number): Promise<void>;
  getSelectedDate(): Promise<string>;
  getCurrentCalendarMonthYear(): Promise<string>;
}

/**
 * Interfaz compuesta que combina todas las capacidades de la página de registro.
 * Para clases que necesiten tanto validación como operaciones de calendario.
 */
export interface ICompleteRegisterPage extends IRegisterPage, ICalendarOperations {}