import { Readable, Transform, Writable } from "stream";

export default function Terceiro() {
  //! Exemplo sincrono (deixei o async no exemplo2)
  const input = new Readable({
    read() {
      for (let i = 0; i < 10000; i++) {
        const data = crypto.randomUUID();
        this.push(data);
      }
      this.push(null);
    }
  });

  const toUpperCase = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    }
  });

  const addHello = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, `Hello ${chunk.toString()}`);
    }
  });

  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log(chunk.toString());
      callback();
    }
  });

  input
    .pipe(toUpperCase)
    .pipe(addHello)
    .pipe(output); // conecta o input com o output
}