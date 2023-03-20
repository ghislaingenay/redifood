export interface ISettings {
  user: string;
  currency: string; // Change to ECurrency later
  vat: number;
  language: string; // Change to ELanguage
  haveFoodDescription: boolean;
  haveFoodImage: boolean;
}

export interface ISettingsBody extends Omit<ISettings, "user"> {
  userId: string;
}
