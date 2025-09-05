import { Readable, Writable } from "stream";

export default function Primeiro() {
  const input = new Readable({
    read() {
      this.push("Hello");
      this.push("World!");
      this.push(null); // pra informar que acabou
    }
  });

  const output = new Writable({
    //chunk é o dado que está chegando (cada item do 'push' acima por exemplo)
    //encoding é o formato do dado
    //callback é uma função que deve ser chamada quando o processamento do chunk acabar
    write(chunk, encoding, callback) {
      console.log(chunk.toString());
      callback();
    }
  });

  input.pipe(output); // conecta o input com o output
}