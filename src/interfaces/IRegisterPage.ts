export interface IRegisterPage {
  verifyProgressElements(): Promise<void>;
  verifyPersonalDataElements(): Promise<void>;
  verifyDocumentTypeElements(): Promise<void>;
  verifyNavigationElements(): Promise<void>;
}