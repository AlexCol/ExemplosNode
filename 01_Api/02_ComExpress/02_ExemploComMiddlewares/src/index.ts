import express from 'express';
import { addAppConfigurations } from './configuration/toApp/addAppConfigurations';

const app = express();

//centralizado as chamadas para adicionar as configurações ao app
addAppConfigurations(app);

async function startServer() {
  try {
    app.listen(3000, () => {
      console.log('Servidor ouvindo na porta 3000.');
    });
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
  }
}
startServer();