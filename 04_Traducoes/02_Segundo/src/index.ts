import express from "express";
import { initI18n } from "./i18n";
import { getUser } from "./modules/user/user.controller";

async function bootstrap() {
  await initI18n(); // <-- leitura dos arquivos acontece aqui

  const app = express();

  app.get("/user", getUser);

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

bootstrap();
