import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

const SUPPORTED_LOCALES = ["pt-BR", "en"];
const NAMESPACES = ["usuarios", "financeiro", "contratos"];

export async function initI18n() {
  await i18next.use(Backend).init({
    fallbackLng: "pt-BR",

    preload: SUPPORTED_LOCALES,
    ns: NAMESPACES,
    defaultNS: "usuarios",

    backend: {
      loadPath: path.join(__dirname, "translations/{{lng}}/{{ns}}.json"),
    },

    interpolation: {
      escapeValue: false,
    },
  });
}

export function t(locale: string, key: string, options?: Record<string, any>) {
  return i18next.t(key, {
    lng: locale,
    ...options,
  });
}
