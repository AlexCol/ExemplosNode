import express from "express";
import fs from "fs";
import { Readable } from "stream";

const SEED_PATH = './src/util/seed.txt';
const FILE_NAME = 'big-file.txt';
const OUT_PATH = `C:/Temp/${FILE_NAME}`;

export function SextoViaHttp() {
  const app = express();

  app.get("/big-file", (req, res) => {
    const seed = fs.readFileSync(SEED_PATH, { encoding: "utf-8" });
    const targetSize = Math.pow(1024, 3) * 1; // 1GB
    const repetitions = Math.ceil(targetSize / seed.length);

    res.setHeader("Content-Type", "text/plain");

    const generate = new Readable({
      read() {
        for (let i = 0; i < repetitions; i++) {
          this.push(seed);
        }
        this.push(null); // encerra stream
      }
    });

    // Em vez de escrever em arquivo, enviamos direto para o cliente
    generate.pipe(res);
  });

  app.get("/download", (req, res) => {
    const filePath = OUT_PATH;

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=big-file.txt");

    // Cria um ReadableStream do arquivo
    const readStream = fs.createReadStream(filePath);

    // Pipe para o cliente: envia em chunks automaticamente
    readStream.pipe(res);
  });

  app.listen(3000, () => console.log("Server running at http://localhost:3000"));
}