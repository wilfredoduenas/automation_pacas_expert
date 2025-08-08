import { Locator, Page, expect, test } from "@playwright/test";
import { BasePage } from "./BasePage";
import { IHomePage } from "../interfaces/IHomePage";

/**
 * Page Object Model para la Home, centraliza locators y lógica de verificación.
 * Permite fácil extensión y mantenimiento.
 */
export class HomePage extends BasePage implements IHomePage {
  /**
   * Variables del menú de navegación.
   */
  private readonly menuHomeButton: Locator;
  private readonly menuCoursesDropdown: Locator;
  private readonly menuCalculatorButton: Locator;
  private readonly menuAyuButton: Locator;
  private readonly menuNewsButton: Locator;
  private readonly menuPointsButton: Locator;
  private readonly menuWhatsAppLink: Locator;
  private readonly menuSignInButton: Locator;

  /**
   * Variables de la sección de beneficios.
   */
  private readonly benefitsCoursesIcon: Locator;
  private readonly benefitsCoursesText: Locator;
  private readonly benefitsCalculatorIcon: Locator;
  private readonly benefitsCalculatorText: Locator;
  private readonly benefitsAyuIcon: Locator;
  private readonly benefitsAyuText: Locator;
  private readonly benefitsPointsIcon: Locator;
  private readonly benefitsPointsText: Locator;
  private readonly benefitsCoursesCard: Locator;
  private readonly benefitsCalculatorCard: Locator;
  private readonly benefitsAyuCard: Locator;
  private readonly benefitsPointsCard: Locator;

  /**
   * Variables de la sección de cursos.
   */
  private readonly coursesPresentialButton: Locator;
  private readonly coursesVirtualButton: Locator;
  private readonly coursesExpressButton: Locator;

  /**
   * Variables de la sección de novedades.
   */
  private readonly newsPacasmayo1Button: Locator;
  private readonly newsPacasmayo2Button: Locator;
  private readonly newsCultivaluButton: Locator;
  private readonly newsViewMoreButton: Locator;

  /**
   * Variables de la sección de pie de página.
   */
  private readonly preFooterFacebookLink: Locator;
  private readonly preFooterInstagramLink: Locator;
  private readonly preFooterYouTubeLink: Locator;
  private readonly preFooterTikTokLink: Locator;
  private readonly preFooterPresentialCoursesSpan: Locator;
  private readonly preFooterVirtualCoursesSpan: Locator;
  private readonly preFooterExpressLearningSpan: Locator;
  private readonly preFooterCalculatorText: Locator;
  private readonly preFooterAyuText: Locator;
  private readonly preFooterNewsText: Locator;
  private readonly preFooterPointsText: Locator;
  private readonly preFooterTermsLink: Locator;
  private readonly preFooterTreatmentLink: Locator;
  private readonly preFooterPromotionsLink: Locator;
  private readonly preFooterCookiesLink: Locator;

  /**
   * Variables de la sección de pie de página.
   */
  private readonly footerComplaintsLink: Locator;
  private readonly footerDonManuelButton: Locator;

  /**
   * Locators para el menú de navegación.
   */
  private menuLocators = [
    () =>
      this.page.getByRole("navigation").getByRole("link", { name: "bg-auth" }),
    () => this.page.getByRole("menu").getByRole("button", { name: "Inicio" }),
    () => this.page.getByRole("button", { name: "Cursos v", exact: true }),
    () =>
      this.page.getByRole("menu").getByRole("button", { name: "Calculadora" }),
    () => this.page.getByRole("menu").getByRole("button", { name: "AYU" }),
    () =>
      this.page.getByRole("menu").getByRole("button", { name: "Novedades" }),
    () =>
      this.page
        .getByRole("menu")
        .getByRole("button", { name: "ConstruyePuntos" }),
    () => this.page.getByRole("link", { name: "whatsapp" }).first(),
    () => this.page.getByRole("button", { name: "Iniciar sesión" }).first(),
  ];

  /**
   * Locators para el carrusel.
   */
  private carouselLocators = [
    () => this.page.getByLabel("Previous Page"),
    () => this.page.getByLabel("Next Page"),
    () => this.page.getByRole("img", { name: "bg_nosotros" }),
  ];

  /**
   * Locators para la sección de expertos.
   */
  private expertLocators = [
    () =>
      this.page.getByRole("img", { name: "construye-experto", exact: true }),
    () =>
      this.page.getByRole("heading", { name: "Construye Experto es el mundo" }),
    () => this.page.getByText("En Pacasmayo reconocemos tu"),
  ];

  /**
   * Locators para la sección de beneficios.
   */
  private benefitsLocators = [
    () =>
      this.page
        .locator("app-section-benefits")
        .getByRole("heading", { name: "Beneficios" }),
    () => this.page.getByRole("img", { name: "assets/svg/public/course.svg" }),
    () => this.page.locator("app-section-benefits").getByText("Cursos"),
    () => this.page.getByRole("img", { name: "assets/svg/public/calculator." }),
    () => this.page.getByRole("paragraph").filter({ hasText: "Calculadora" }),
    () => this.page.getByRole("img", { name: "assets/svg/public/ayu.svg" }),
    () => this.page.getByText("AYU MO"),
    () => this.page.getByRole("img", { name: "assets/svg/public/points.svg" }),
    () => this.page.getByText("ContruyePuntos"),
    () =>
      this.page
        .locator("app-section-benefits div")
        .filter({ hasText: "Cursos" }),
    () => this.page.locator("div").filter({ hasText: /^Calculadora$/ }),
    () => this.page.locator("div").filter({ hasText: "AYU MO" }),
    () => this.page.locator("div").filter({ hasText: "ContruyePuntos" }),
  ];

  /**
   * Locators para la sección de cursos.
   */
  private coursesLocators = [
    () => this.page.getByRole("heading", { name: "Cursos" }),
    () => this.page.getByText("Certifícate GRATIS a tu ritmo"),
    () => this.page.getByRole("button", { name: "Cursos presenciales" }),
    () => this.page.getByRole("button", { name: "Cursos virtuales" }),
    () => this.page.getByRole("button", { name: "Aprendizaje express" }),
  ];

  /**
   * Locators para la sección de noticias.
   */
  private newsLocators = [
    () => this.page.getByRole("heading", { name: "Novedades" }),
    () => this.page.getByText("Entérate de las últimas"),
    () => this.page.getByRole("button", { name: "Pacasmayo 25/07/" }),
    () => this.page.getByRole("button", { name: "Pacasmayo 31/05/" }),
    () =>
      this.page.getByRole("button", { name: "Cultivalu 22/03/2022 Desde el" }),
    () => this.page.getByRole("button", { name: "Ver más novedades" }),
  ];

  /**
   * Locators para la sección de pre pie de página.
   */
  private preFooterLocators = [
    () =>
      this.page
        .locator("app-pre-footer")
        .getByRole("link", { name: "bg-auth" }),
    () => this.page.getByRole("link", { name: "Facebook" }),
    () => this.page.getByRole("link", { name: "Instagram" }),
    () => this.page.getByRole("link", { name: "YouTube" }),
    () => this.page.getByRole("link", { name: "TikTok" }),
    //() => this.page.getByRole("img", { name: "construye-experto-log" }),
    () => this.page.locator("h4").filter({ hasText: "Beneficios" }),
    () => this.page.locator("span").filter({ hasText: "Cursos presenciales" }),
    () => this.page.locator("span").filter({ hasText: "Cursos virtuales" }),
    () => this.page.locator("span").filter({ hasText: "Aprendizaje express" }),
    () => this.page.locator("app-pre-footer").getByText("Calculadora"),
    () => this.page.locator("app-pre-footer").getByText("AYU"),
    () => this.page.locator("app-pre-footer").getByText("Novedades"),
    () => this.page.locator("app-pre-footer").getByText("ConstruyePuntos"),
    () => this.page.getByRole("heading", { name: "Políticas y condiciones" }),
    () =>
      this.page.getByRole("link", { name: "Términos y condiciones y polí" }),
    () => this.page.getByRole("link", { name: "Tratamiento opcional de los" }),
    () => this.page.getByRole("link", { name: "Condiciones de promociones" }),
    () => this.page.getByRole("link", { name: "Cookies" }),
  ];

  /**
   * Locators para la sección de pie de página.
   */
  private footerLocators = [
    () => this.page.getByRole("img", { name: "web-pacasmayo-logo" }),
    () => this.page.getByText("© 2025 ConstruyeExperto."),
    //() => this.page.getByRole("link", { name: "complaints-book" }),
    () => this.page.getByRole("button", { name: "don-manuel" }),
  ];

  /**
   * Constructor for the HomePage class.
   * @param page The Playwright page object.
   */
  constructor(page: Page) {
    super(page);

    /** Menu Section */
    this.menuHomeButton = this.page
      .getByRole("menu")
      .getByRole("button", { name: "Inicio" });
    this.menuCoursesDropdown = this.page.getByRole("button", {
      name: "Cursos v",
      exact: true,
    });
    this.menuCalculatorButton = this.page
      .getByRole("menu")
      .getByRole("button", { name: "Calculadora" });
    this.menuAyuButton = this.page
      .getByRole("menu")
      .getByRole("button", { name: "AYU" });
    this.menuNewsButton = this.page
      .getByRole("menu")
      .getByRole("button", { name: "Novedades" });
    this.menuPointsButton = this.page
      .getByRole("menu")
      .getByRole("button", { name: "ConstruyePuntos" });
    this.menuWhatsAppLink = this.page
      .getByRole("link", { name: "whatsapp" })
      .first();
    this.menuSignInButton = this.page
      .getByRole("button", { name: "Iniciar sesión" })
      .first();

    /** Benefits Section */
    this.benefitsCoursesIcon = this.page.getByRole("img", {
      name: "assets/svg/public/course.svg",
    });
    this.benefitsCoursesText = this.page
      .locator("app-section-benefits")
      .getByText("Cursos");
    this.benefitsCalculatorIcon = this.page.getByRole("img", {
      name: "assets/svg/public/calculator.",
    });
    this.benefitsCalculatorText = this.page
      .getByRole("paragraph")
      .filter({ hasText: "Calculadora" });
    this.benefitsAyuIcon = this.page.getByRole("img", {
      name: "assets/svg/public/ayu.svg",
    });
    this.benefitsAyuText = this.page.getByText("AYU MO");
    this.benefitsPointsIcon = this.page.getByRole("img", {
      name: "assets/svg/public/points.svg",
    });
    this.benefitsPointsText = this.page.getByText("ContruyePuntos");
    this.benefitsCoursesCard = this.page
      .locator("app-section-benefits div")
      .filter({ hasText: "Cursos" });
    this.benefitsCalculatorCard = this.page
      .locator("div")
      .filter({ hasText: /^Calculadora$/ });
    this.benefitsAyuCard = this.page
      .locator("div")
      .filter({ hasText: "AYU MO" });
    this.benefitsPointsCard = this.page
      .locator("div")
      .filter({ hasText: "ContruyePuntos" });

    /** Courses Section */
    this.coursesPresentialButton = this.page.getByRole("button", {
      name: "Cursos presenciales",
    });
    this.coursesVirtualButton = this.page.getByRole("button", {
      name: "Cursos virtuales",
    });
    this.coursesExpressButton = this.page.getByRole("button", {
      name: "Aprendizaje express",
    });

    /** News Section */
    this.newsPacasmayo1Button = this.page.getByRole("button", {
      name: "Pacasmayo 25/07/",
    });
    this.newsPacasmayo2Button = this.page.getByRole("button", {
      name: "Pacasmayo 31/05/",
    });
    this.newsCultivaluButton = this.page.getByRole("button", {
      name: "Cultivalu 22/03/2022 Desde el",
    });
    this.newsViewMoreButton = this.page.getByRole("button", {
      name: "Ver más novedades",
    });

    /** Pre-Footer Section */
    this.preFooterFacebookLink = this.page.getByRole("link", {
      name: "Facebook",
    });
    this.preFooterInstagramLink = this.page.getByRole("link", {
      name: "Instagram",
    });
    this.preFooterYouTubeLink = this.page.getByRole("link", {
      name: "YouTube",
    });
    this.preFooterTikTokLink = this.page.getByRole("link", { name: "TikTok" });
    this.preFooterPresentialCoursesSpan = this.page
      .locator("span")
      .filter({ hasText: "Cursos presenciales" });
    this.preFooterVirtualCoursesSpan = this.page
      .locator("span")
      .filter({ hasText: "Cursos virtuales" });
    this.preFooterExpressLearningSpan = this.page
      .locator("span")
      .filter({ hasText: "Aprendizaje express" });
    this.preFooterCalculatorText = this.page
      .locator("app-pre-footer")
      .getByText("Calculadora");
    this.preFooterAyuText = this.page
      .locator("app-pre-footer")
      .getByText("AYU");
    this.preFooterNewsText = this.page
      .locator("app-pre-footer")
      .getByText("Novedades");
    this.preFooterPointsText = this.page
      .locator("app-pre-footer")
      .getByText("ConstruyePuntos");
    this.preFooterTermsLink = this.page.getByRole("link", {
      name: "Términos y condiciones y polí",
    });
    this.preFooterTreatmentLink = this.page.getByRole("link", {
      name: "Tratamiento opcional de los",
    });
    this.preFooterPromotionsLink = this.page.getByRole("link", {
      name: "Condiciones de promociones",
    });
    this.preFooterCookiesLink = this.page.getByRole("link", {
      name: "Cookies",
    });

    /** Footer Section */
    this.footerComplaintsLink = this.page.getByRole("link", {
      name: "complaints-book",
    });
    this.footerDonManuelButton = this.page.getByRole("button", {
      name: "don-manuel",
    });
  }

  /**
   * Verificaciones de elementos en la sección de menú.
   */
  async verifyMenuElements(): Promise<void> {
    await this.verifySection(this.menuLocators, "Menu");
  }

  /**
   * Verificaciones de elementos en la sección de carrusel.
   */
  public async verifyCarouselElements(): Promise<void> {
    await this.verifySection(this.carouselLocators, "Carousel");
  }

  /**
   * Verificaciones de elementos en la sección de expertos.
   */
  public async verifyExpertElements(): Promise<void> {
    await this.verifySection(this.expertLocators, "Expert");
  }

  /**
   * Verificaciones de elementos en la sección de beneficios.
   */
  public async verifyBenefitsElements(): Promise<void> {
    await this.verifySection(this.benefitsLocators, "Benefits");
  }

  /**
   * Verificaciones de elementos en la sección de cursos.
   */
  public async verifyCoursesElements(): Promise<void> {
    await this.verifySection(this.coursesLocators, "Courses");
  }

  /**
   * Verificaciones de elementos en la sección de noticias.
   */
  public async verifyNewsElements(): Promise<void> {
    await this.verifySection(this.newsLocators, "News");
  }

  /**
   * Verificaciones de elementos en la sección de pre pie de página.
   */
  public async verifyPreFooterElements(): Promise<void> {
    await this.verifySection(this.preFooterLocators, "Pre-Footer");
  }

  /**
   * Verificaciones de elementos en la sección de pie de página.
   */
  public async verifyFooterElements(): Promise<void> {
    await this.verifySection(this.footerLocators, "Footer");
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
   * METHODS FOR CLICKING ON MENU ITEMS
   */
  /**
   * Click en el botón de inicio del menú.
   */
  public async clickMenuHome(): Promise<void> {
    await this.menuHomeButton.click();
  }

  /**
   * Click en el menú de cursos.
   */
  public async clickMenuCoursesDropdown(): Promise<void> {
    await this.menuCoursesDropdown.click();
  }

  /**
   * Click en el menú de calculadora.
   */
  public async clickMenuCalculator(): Promise<void> {
    await this.menuCalculatorButton.click();
  }

  /**
   * Click en el menú de ayuda.
   */
  public async clickMenuAyu(): Promise<void> {
    await this.menuAyuButton.click();
  }

  /**
   * Click en el menú de noticias.
   */
  public async clickMenuNews(): Promise<void> {
    await this.menuNewsButton.click();
  }

  /**
   * Click en el menú de puntos.
   */
  public async clickMenuPoints(): Promise<void> {
    await this.menuPointsButton.click();
  }

  /**
   * Click en el menú de WhatsApp.
   */
  public async clickMenuWhatsApp(): Promise<void> {
    await this.menuWhatsAppLink.click();
  }

  /**
   * Click en el menú de inicio de sesión.
   */
  public async clickMenuSignIn(): Promise<void> {
    await this.menuSignInButton.click();
  }

  /**
   * METHODS FOR CLICKING ON COURSES MENU ITEMS
   */
  /**
   * Click en el menú de cursos presenciales.
   */
  public async clickCoursesPresential(): Promise<void> {
    await this.coursesPresentialButton.click();
  }

  /**
   * Click en el menú de cursos virtuales.
   */
  public async clickCoursesVirtual(): Promise<void> {
    await this.coursesVirtualButton.click();
  }

  /**
   * Click en el menú de cursos express.
   */
  public async clickCoursesExpress(): Promise<void> {
    await this.coursesExpressButton.click();
  }

  /**
   * BENEFITS SECTION CLICK METHODS
   */

  /**
   * Click en el icono de cursos en la sección de beneficios.
   */
  public async clickBenefitsCoursesIcon(): Promise<void> {
    await this.benefitsCoursesIcon.click();
  }

  /**
   * Click en el texto de cursos en la sección de beneficios.
   */
  public async clickBenefitsCoursesText(): Promise<void> {
    await this.benefitsCoursesText.click();
  }

  /**
   * Click en el icono de calculadora en la sección de beneficios.
   */
  public async clickBenefitsCalculatorIcon(): Promise<void> {
    await this.benefitsCalculatorIcon.click();
  }

  /**
   * Click en el texto de calculadora en la sección de beneficios.
   */
  public async clickBenefitsCalculatorText(): Promise<void> {
    await this.benefitsCalculatorText.click();
  }

  /**
   * Click en el icono de AYU en la sección de beneficios.
   */
  public async clickBenefitsAyuIcon(): Promise<void> {
    await this.benefitsAyuIcon.click();
  }

  /**
   * Click en el texto de AYU en la sección de beneficios.
   */
  public async clickBenefitsAyuText(): Promise<void> {
    await this.benefitsAyuText.click();
  }

  /**
   * Click en el icono de puntos en la sección de beneficios.
   */
  public async clickBenefitsPointsIcon(): Promise<void> {
    await this.benefitsPointsIcon.click();
  }

  /**
   * Click en el texto de puntos en la sección de beneficios.
   */
  public async clickBenefitsPointsText(): Promise<void> {
    await this.benefitsPointsText.click();
  }

  /**
   * Click en la tarjeta de cursos en la sección de beneficios.
   */
  public async clickBenefitsCoursesCard(): Promise<void> {
    await this.benefitsCoursesCard.click();
  }

  /**
   * Click en la tarjeta de calculadora en la sección de beneficios.
   */
  public async clickBenefitsCalculatorCard(): Promise<void> {
    await this.benefitsCalculatorCard.click();
  }

  /**
   * Click en la tarjeta de AYU en la sección de beneficios.
   */
  public async clickBenefitsAyuCard(): Promise<void> {
    await this.benefitsAyuCard.click();
  }

  /**
   * Click en la tarjeta de puntos en la sección de beneficios.
   */
  public async clickBenefitsPointsCard(): Promise<void> {
    await this.benefitsPointsCard.click();
  }

  /**
   * NEWS SECTION CLICK METHODS
   */

  /**
   * Click en la primera noticia de Pacasmayo.
   */
  public async clickNewsPacasmayo1(): Promise<void> {
    await this.newsPacasmayo1Button.click();
  }

  /**
   * Click en la segunda noticia de Pacasmayo.
   */
  public async clickNewsPacasmayo2(): Promise<void> {
    await this.newsPacasmayo2Button.click();
  }

  /**
   * Click en la noticia de Cultivalu.
   */
  public async clickNewsCultivalu(): Promise<void> {
    await this.newsCultivaluButton.click();
  }

  /**
   * Click en el botón "Ver más novedades".
   */
  public async clickNewsViewMore(): Promise<void> {
    await this.newsViewMoreButton.click();
  }

  /**
   * PRE-FOOTER SECTION CLICK METHODS
   */

  /**
   * Click en el enlace de Facebook en el pre-footer.
   */
  public async clickPreFooterFacebook(): Promise<void> {
    await this.preFooterFacebookLink.click();
  }

  /**
   * Click en el enlace de Instagram en el pre-footer.
   */
  public async clickPreFooterInstagram(): Promise<void> {
    await this.preFooterInstagramLink.click();
  }

  /**
   * Click en el enlace de YouTube en el pre-footer.
   */
  public async clickPreFooterYouTube(): Promise<void> {
    await this.preFooterYouTubeLink.click();
  }

  /**
   * Click en el enlace de TikTok en el pre-footer.
   */
  public async clickPreFooterTikTok(): Promise<void> {
    await this.preFooterTikTokLink.click();
  }

  /**
   * Click en el span de cursos presenciales en el pre-footer.
   */
  public async clickPreFooterPresentialCourses(): Promise<void> {
    await this.preFooterPresentialCoursesSpan.click();
  }

  /**
   * Click en el span de cursos virtuales en el pre-footer.
   */
  public async clickPreFooterVirtualCourses(): Promise<void> {
    await this.preFooterVirtualCoursesSpan.click();
  }

  /**
   * Click en el span de aprendizaje express en el pre-footer.
   */
  public async clickPreFooterExpressLearning(): Promise<void> {
    await this.preFooterExpressLearningSpan.click();
  }

  /**
   * Click en el texto de calculadora en el pre-footer.
   */
  public async clickPreFooterCalculator(): Promise<void> {
    await this.preFooterCalculatorText.click();
  }

  /**
   * Click en el texto de AYU en el pre-footer.
   */
  public async clickPreFooterAyu(): Promise<void> {
    await this.preFooterAyuText.click();
  }

  /**
   * Click en el texto de noticias en el pre-footer.
   */
  public async clickPreFooterNews(): Promise<void> {
    await this.preFooterNewsText.click();
  }

  /**
   * Click en el texto de puntos en el pre-footer.
   */
  public async clickPreFooterPoints(): Promise<void> {
    await this.preFooterPointsText.click();
  }

  /**
   * Click en el enlace de términos y condiciones en el pre-footer.
   */
  public async clickPreFooterTerms(): Promise<void> {
    await this.preFooterTermsLink.click();
  }

  /**
   * Click en el enlace de tratamiento de datos en el pre-footer.
   */
  public async clickPreFooterTreatment(): Promise<void> {
    await this.preFooterTreatmentLink.click();
  }

  /**
   * Click en el enlace de condiciones de promociones en el pre-footer.
   */
  public async clickPreFooterPromotions(): Promise<void> {
    await this.preFooterPromotionsLink.click();
  }

  /**
   * Click en el enlace de cookies en el pre-footer.
   */
  public async clickPreFooterCookies(): Promise<void> {
    await this.preFooterCookiesLink.click();
  }

  /**
   * FOOTER SECTION CLICK METHODS
   */

  /**
   * Click en el enlace del libro de reclamaciones en el footer.
   */
  public async clickFooterComplaints(): Promise<void> {
    await this.footerComplaintsLink.click();
  }

  /**
   * Click en el botón de Don Manuel en el footer.
   */
  public async clickFooterDonManuel(): Promise<void> {
    await this.footerDonManuelButton.click();
  }
}
