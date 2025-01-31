import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { translationsResource } from "@/i18n/locales";

export const defaultNS = "common";
export const resources = translationsResource as const;

i18n.use(initReactI18next).init({
	lng: window.localStorage.defaultLanguage || "en",
	ns: ["common", "croissantage", "pages"],
	defaultNS,
	resources,
	interpolation: {
		escapeValue: false, // react already safes from xss
	},
});

export default i18n;
