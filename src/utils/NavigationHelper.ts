import { Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { BasePage } from "../pages/BasePage";

/**
 * Helper para operaciones comunes de navegación y autenticación.
 * Encapsula flujos recurrentes siguiendo el principio DRY.
 * Optimizado para evitar duplicación de código y mantener eficiencia.
 */
export class NavigationHelper {
  private page: Page;
  private homePage: HomePage;
  private loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.homePage = new HomePage(page); // Instancia única reutilizable
    this.loginPage = new LoginPage(page); // Instancia única reutilizable
  }

  /**
   * Método privado para navegar a home y ejecutar una acción específica.
   * Elimina duplicación de código entre métodos públicos.
   */
  private async navigateAndExecute(action?: () => Promise<void>): Promise<void> {
    await this.homePage.goto(BasePage.HOME_URL);
    if (action) {
      await action();
    }
  }

  /**
   * Navega a la página de inicio.
   */
  async navigateToHome(): Promise<void> {
    await this.navigateAndExecute();
  }

  /**
   * Navega a la página de login.
   * Método reutilizable para todos los tests que requieren autenticación.
   */
  async navigateToLogin(): Promise<void> {
    await this.navigateAndExecute(async () => {
      await this.homePage.clickMenuSignIn();
    });
  }

  /**
   * Navega a la sección de cursos.
   */
  async navigateToCourses(): Promise<void> {
    await this.navigateAndExecute(async () => {
      await this.homePage.clickMenuCoursesDropdown();
    });
  }

  /**
   * Navega a la calculadora.
   */
  async navigateToCalculator(): Promise<void> {
    await this.navigateAndExecute(async () => {
      await this.homePage.clickMenuCalculator();
    });
  }

  /**
   * Navega a la sección de noticias.
   */
  async navigateToNews(): Promise<void> {
    await this.navigateAndExecute(async () => {
      await this.homePage.clickMenuNews();
    });
  }

  /**
   * Navega a ConstruyePuntos.
   */
  async navigateToPoints(): Promise<void> {
    await this.navigateAndExecute(async () => {
      await this.homePage.clickMenuPoints();
    });
  }

  /**
   * Navega directamente a la página de registro.
   */
  async navigateToRegister(): Promise<void> {
    await this.navigateToLogin();
    await this.loginPage.clickAlternativeAccessRegisterButton();
  }

  /**
   * Navega como invitado.
   */
  async navigateAsGuest(): Promise<void> {
    await this.navigateToLogin();
    await this.loginPage.clickAlternativeAccessGuestButton();
  }

  /**
   * Navega a una URL específica con validación opcional.
   * @param url - URL de destino
   * @param expectedElement - Elemento que debe estar presente para confirmar navegación
   */
  async navigateToUrlWithValidation(url: string, expectedElement?: string): Promise<void> {
    await this.page.goto(url);
    if (expectedElement) {
      await this.page.waitForSelector(expectedElement);
    }
  }
}
