export interface ILoginPage {
  verifyWelcomeElements(): Promise<void>;
  verifyCredentialsElements(): Promise<void>;
  verifyAlternativeAccessElements(): Promise<void>;
}
