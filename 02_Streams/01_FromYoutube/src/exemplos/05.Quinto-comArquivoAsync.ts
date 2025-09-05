import fs from "fs";
import { Readable, Transform } from "stream";

const SEED_PATH = './src/util/seed.txt';
const FILE_NAME = 'big-file.txt';
const OUT_PATH = `C:/Temp/${FILE_NAME}`;

export default async function QuintoFileAsync() {
  await ProcessFile();
  contFileWords();
}

function ProcessFile() {
  return new Promise<void>((resolve) => {
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
      resolve();
    });
  });
}

function contFileWords() {
  console.time('Counting words...');
  const bigFile = fs.createReadStream(OUT_PATH, { encoding: 'utf-8' });
  const countWords = new Transform({
    transform(chunk, encoding, callback) {
      const words = chunk.toString().split(' ');
      this.wordCount = (this.wordCount || 0) + words.length;
      callback();
    },
    flush(callback) {
      this.push(`Total words: ${this.wordCount}\n`);
      callback();
    }
  });

  bigFile.pipe(countWords).pipe(process.stdout);
  countWords.on('finish', () => {
    console.timeEnd('Counting words...');
  });
}

declare module 'stream' {
  interface Transform {
    wordCount?: number;
  }
}