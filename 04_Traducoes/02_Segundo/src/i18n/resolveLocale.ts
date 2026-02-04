import { Request } from "express";

const SUPPORTED_LOCALES = ["pt-BR", "en"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

export function resolveLocale(req: Request): Locale {
  const header = req.headers["accept-language"];
  if (!header) return "pt-BR";

  const locale = header.split(",")[0];

  return SUPPORTED_LOCALES.includes(locale as Locale) ? (locale as Locale) : "pt-BR";
}
