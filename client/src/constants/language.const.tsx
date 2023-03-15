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
