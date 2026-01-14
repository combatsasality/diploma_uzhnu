import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";

export const resources = {
  en: {
    translation: en,
  },
};

export const defaultNS = "translation";

// Type definitions for translation key paths
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type TxKeyPath = DeepKeys<typeof en>;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  defaultNS,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
