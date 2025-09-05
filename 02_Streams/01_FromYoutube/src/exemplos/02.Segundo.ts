import { Readable, Writable } from "stream";

export default function Segundo() {
  let i = 0;
  const input = new Readable({
    read() {
      if (i < 10) {
        setImmediate(() => { // empurra 1 por vez de forma assíncrona
          console.log(`pushed ${i}`);
          this.push(i.toString());
          i++;
        });
      } else {
        this.push(null);
      }
    }
  });

  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log("writing...");
      console.log(chunk.toString());
      callback();
    }
  });

  input.pipe(output); // conecta o input com o output
}

// Exemplo de Readable/Writable em Node.js:
// - this.push() sem setImmediate empurra tudo de uma vez; o Writable só escreve depois.
// - Com setImmediate, cada push roda em um tick diferente do event loop, intercalando produção (push) e consumo (write).
// - Sempre finalize com this.push(null) para sinalizar o fim do stream.
