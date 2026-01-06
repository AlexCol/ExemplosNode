import express, { NextFunction, Request, Response } from "express";
import { dicionario, loadDicionario, recarregarDicionario } from "./textos";

const app = express();
const port = 3321;
loadDicionario();

app.get('/', (req: Request, res: Response) => {
  const lang: string = (req.query.lang as string) || 'ptBr';
  res.send({
    "HELLO": dicionario[lang]['test']['HELLO'],
    "LOGIN_FAILED": dicionario[lang]['auth']['LOGIN_FAILED'],
    "Chave Super Composta": dicionario[lang]['test']['Chave Super Composta'],
  });
});

app.get('/reload-dictionary', (req: Request, res: Response) => {
  try {
    recarregarDicionario();
    res.send({ status: 'Dicionário recarregado com sucesso' });
  } catch (error) {
    res.status(500).send({ status: 'Erro ao recarregar o dicionário', error });
  }
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});