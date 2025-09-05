import fs from "fs";
import { Readable } from "stream";

export default function SetimoFile() {
  const SEED_PATH = './src/util/seed.txt';
  const FILE_NAME = 'big-file.txt';
  const OUT_PATH = `C:/Temp/${FILE_NAME}`;

  const seed = fs.readFileSync(SEED_PATH, { encoding: 'utf-8' });
  const targetSize = Math.pow(1024, 3) * 8; // 8GB
  const repetitions = Math.ceil(targetSize / seed.length);

  console.time('Generating file...');
  let i = 0;
  const generate = new Readable({
    read() {
      if (i < repetitions) {
        setImmediate(() => { //fica mais rapido que o ex 4
          this.push(seed);
          i++;
        });
      } else {
        this.push(null);
      }
    }
  });

  const outStream = fs.createWriteStream(OUT_PATH);

  generate.pipe(outStream);
  generate.on('end', () => {
    console.timeEnd('Generating file...');
  });
}