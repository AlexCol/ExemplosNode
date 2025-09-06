const exemplo1 = () => {
  function* numbers() {
    yield 1;
    yield 2;
    yield 3;
  }

  const gen = numbers();
  console.log(gen.next()); // { value: 1, done: false }
  console.log(gen.next()); // { value: 2, done: false }
  console.log(gen.next()); // { value: 3, done: false }
  console.log(gen.next()); // { value: undefined, done: true }
};

const exemplo2 = async () => {
  async function* asyncNumbers(): AsyncGenerator<number> {
    for (let i = 1; i <= 3; i++) {
      await new Promise(r => setTimeout(r, 100)); // simula async
      yield i;
    }
  }

  (async () => {
    const gen = asyncNumbers(); // retorna AsyncGenerator<number>
    for await (const n of gen) {
      console.log(n); // 1, 2, 3
    }
  })();
};

//exemplo1();
exemplo2();