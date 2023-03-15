import { ELanguage } from "../interfaces";

type RecordLanguage = Record<ELanguage, string>;

interface TIndexLanguage {
  showProperAmount: RecordLanguage;
  showPayButton: RecordLanguage;
  showEditBtn: RecordLanguage;
  selectValue: RecordLanguage;
}
// index page  => redifood/
export const indexLanguageOptions: TIndexLanguage = {
  showProperAmount: { fr: "Montant", en: "Amount" },
  showPayButton: { fr: "PAYER", en: "PAY" },
  showEditBtn: { fr: "MODIFIER", en: "EDIT" },
  selectValue: { fr: "TOUS", en: "ALL" },
};

interface TLanguage {
  showLanguageFrInfo: RecordLanguage;
  showLanguageEnInfo: RecordLanguage;
}

export const LanguageOptions: TLanguage = {
  showLanguageFrInfo: { fr: "Français", en: "French" },
  showLanguageEnInfo: { fr: "Anglais", en: "English" },
};

interface TYesNoLanguageOptions {
  yes: RecordLanguage;
  no: RecordLanguage;
}

export const YesNoOptions: TYesNoLanguageOptions = {
  yes: { fr: "Oui", en: "Yes" },
  no: { fr: "Non", en: "No" },
};
