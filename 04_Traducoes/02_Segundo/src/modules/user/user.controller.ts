import { Request, Response } from "express";
import { t } from "../../i18n";
import { resolveLocale } from "../../i18n/resolveLocale";

export function getUser(req: Request, res: Response) {
  const locale = resolveLocale(req);

  const userExists = true;

  if (!userExists) {
    return res.status(404).json({
      error: t(locale, "usuarios:notFound"),
      /* //ou
      error: t(locale, "notFound", {
        ns: "usuarios",
      }),
      */
    });
  }

  const userMessage = t(locale, "usuarios:welcome", { name: "Alex" });
  const invoiceMessage = t(locale, "financeiro:invoiceCount_one", { count: 1 });

  return res.json({
    message: userMessage,
    invoices: invoiceMessage,
  });
}
