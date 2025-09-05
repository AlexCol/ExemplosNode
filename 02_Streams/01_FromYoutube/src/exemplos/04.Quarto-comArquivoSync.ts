import fs from "fs";
import { Readable } from "stream";

export default function QuartoFileSync() {
  const SEED_PATH = './src/util/seed.txt';
  const FILE_NAME = 'big-file.txt';
  const OUT_PATH = `C:/Temp/${FILE_NAME}`;

  const seed = fs.readFileSync(SEED_PATH, { encoding: 'utf-8' });
  const targetSize = Math.pow(1024, 3) * 8; // 8GB
  const repetitions = Math.ceil(targetSize / seed.length);

  console.time('Generating file...');
  const generate = new Readable({
    read() {
      for (let i = 0; i < repetitions; i++) {
        this.push(seed);
      }
      this.push(null);
    }
  });

  const outStream = fs.createWriteStream(OUT_PATH);

  generate.pipe(outStream);
  generate.on('end', () => {
    console.timeEnd('Generating file...');
  });
}