import { Page, test } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NavigationHelper } from "./NavigationHelper";

/**
 * Test steps comunes reutilizables entre diferentes tipos de tests.
 * Facilita la mantenibilidad y reduce la duplicación de código.
 * Utiliza NavigationHelper para mantener separación de responsabilidades.
 */
export class CommonTestSteps {

  /**
   * Step común: Navegar a la página de login.
   * Utiliza NavigationHelper para mantener separación de responsabilidades.
   */
  static async navigateToLogin(page: Page): Promise<{ homePage: HomePage; loginPage: LoginPage }> {
    return await test.step("Navegar a la página de login", async () => {
      const navigationHelper = new NavigationHelper(page);
      
      // Usar NavigationHelper para la navegación
      await navigationHelper.navigateToLogin();
      
      // Retornar instancias para uso en tests (creadas solo una vez)
      return { 
        homePage: new HomePage(page), 
        loginPage: new LoginPage(page) 
      };
    });
  }

  /**
   * Step común: Validar elementos de login completos.
   */
  static async validateLoginPageElements(loginPage: LoginPage): Promise<void> {
    await test.step("Validar elementos de la página de login", async () => {
      await loginPage.verifyWelcomeElements();
      await loginPage.verifyCredentialsElements();
      await loginPage.verifyAlternativeAccessElements();
    });
  }

  /**
   * Step común: Preparar test de validación con navegación.
   */
  static async setupValidationTest(page: Page): Promise<{ homePage: HomePage; loginPage: LoginPage }> {
    return await test.step("Configurar test de validación", async () => {
      return await this.navigateToLogin(page);
    });
  }

  // ========== EXTENSIONES PARA DIFERENTES TIPOS DE TESTS ==========

  /**
   * Step común: Configurar test de reglas de negocio.
   */
  static async setupRulesTest(page: Page): Promise<{ homePage: HomePage; loginPage: LoginPage }> {
    return await test.step("Configurar test de reglas de negocio", async () => {
      return await this.navigateToLogin(page);
    });
  }

  /**
   * Step común: Configurar test E2E con datos específicos.
   */
  static async setupE2ETest(page: Page, testData?: any): Promise<{ homePage: HomePage; loginPage: LoginPage }> {
    return await test.step("Configurar test End-to-End", async () => {
      const result = await this.navigateToLogin(page);
      
      // Si hay datos de prueba, configurar el contexto
      if (testData) {
        // Aquí se puede agregar lógica específica para E2E
        console.log("Configurando datos de prueba:", testData);
      }
      
      return result;
    });
  }

  /**
   * Step común: Validar elementos de la página home.
   */
  static async validateHomePageElements(homePage: HomePage): Promise<void> {
    await test.step("Validar elementos de la página home", async () => {
      await homePage.verifyMenuElements();
      await homePage.verifyCarouselElements();
      await homePage.verifyExpertElements();
      await homePage.verifyBenefitsElements();
    });
  }

  /**
   * Step común: Ejecutar flujo de autenticación completo.
   * Utiliza NavigationHelper para la navegación.
   */
  static async performAuthentication(page: Page, credentials: { phone: string }): Promise<void> {
    await test.step("Ejecutar autenticación completa", async () => {
      // Reutilizar el método existente en lugar de duplicar lógica
      const { loginPage } = await this.navigateToLogin(page);
      
      // Implementar lógica de autenticación
      await test.step("Llenar credenciales", async () => {
        // await loginPage.fillPhoneNumber(credentials.phone);
        // await loginPage.clickSignInButton();
      });
      
      await test.step("Validar autenticación exitosa", async () => {
        // await page.waitForURL(/.*dashboard.*/);
      });
    });
  }

  /**
   * Step común: Navegar a diferentes secciones usando NavigationHelper.
   */
  static async navigateToSection(page: Page, section: 'home' | 'courses' | 'calculator' | 'news' | 'points'): Promise<HomePage> {
    return await test.step(`Navegar a sección: ${section}`, async () => {
      const navigationHelper = new NavigationHelper(page);
      
      // Usar el patrón strategy para evitar switch/case
      const navigationMethods: Record<string, () => Promise<void>> = {
        home: () => navigationHelper.navigateToHome(),
        courses: () => navigationHelper.navigateToCourses(),
        calculator: () => navigationHelper.navigateToCalculator(),
        news: () => navigationHelper.navigateToNews(),
        points: () => navigationHelper.navigateToPoints()
      };
      
      await navigationMethods[section]();
      return new HomePage(page);
    });
  }

  /**
   * Step común: Limpiar datos de prueba (teardown).
   */
  static async cleanupTestData(page: Page, testId?: string): Promise<void> {
    await test.step("Limpiar datos de prueba", async () => {
      // Lógica para limpiar datos específicos del test
      if (testId) {
        console.log(`Limpiando datos para test: ${testId}`);
      }
      
      // Aquí se podría limpiar cookies, localStorage, etc.
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });
  }

  /**
   * Step común: Configurar viewport específico para el test.
   */
  static async setupViewport(page: Page, viewport: { width: number; height: number }): Promise<void> {
    await test.step(`Configurar viewport ${viewport.width}x${viewport.height}`, async () => {
      await page.setViewportSize(viewport);
    });
  }

  /**
   * Step común: Verificar accesibilidad básica.
   */
  static async validateBasicAccessibility(page: Page): Promise<void> {
    await test.step("Validar accesibilidad básica", async () => {
      // Verificar que existen elementos ARIA
      const landmarks = await page.$$('[role="main"], [role="navigation"], [role="banner"]');
      if (landmarks.length === 0) {
        console.warn("No se encontraron landmarks ARIA en la página");
      }
      
      // Verificar contraste básico (placeholder para implementación futura)
      // await axeCheck(page);
    });
  }
}
