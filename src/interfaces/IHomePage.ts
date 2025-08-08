export interface IHomePage {
  verifyMenuElements(): Promise<void>;
  verifyCarouselElements(): Promise<void>;
  verifyExpertElements(): Promise<void>;
  verifyBenefitsElements(): Promise<void>;
  verifyCoursesElements(): Promise<void>;
  verifyNewsElements(): Promise<void>;
  verifyPreFooterElements(): Promise<void>;
  verifyFooterElements(): Promise<void>;
}
