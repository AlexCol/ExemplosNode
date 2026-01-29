import { MonetarioVO } from "../../VOs/MonetarioVO/MonetarioVO";

export function TestaMonetarioVO() {
  console.log("===== TestaMonetarioVO =====");

  const v1 = MonetarioVO.create("10.50");
  const v2 = MonetarioVO.create("2.255"); // formato canônico
  const v3 = MonetarioVO.create(3);

  console.log("v1:", v1.toString());
  console.log("v2:", v2.toString());
  console.log("v3:", v3.toString());

  console.log("Soma:", v1.add(v2).toString()); // 12.75
  console.log("Sub:", v1.subtract(v2).toString()); // 8.25
  console.log("Mult:", v2.multiply(2).toString()); // 4.5
  console.log("Div:", v1.divide(2).toString()); // 5.25

  console.log("Print pt-BR:", v1.print(2, ",")); // 10,50
  console.log("Print US:", v1.print(2, ".")); // 10.50

  console.log("Currency BR:", v1.printCurrency("pt-BR", "BRL"));
  console.log("Currency US:", v1.printCurrency("en-US", "USD"));
  console.log("Currency EU:", v1.printCurrency("de-DE", "EUR"));

  console.log("Escala 2:", v2.withScale(2).toString());
  console.log("Escala 3:", v2.withScale(3).toString());

  console.log("Comparações:");
  console.log("v1 > v2?", v1.greaterThan(v2));
  console.log("v1 < v2?", v1.lessThan(v2));
  console.log("v1 == 10.50?", v1.equals(MonetarioVO.create("10.50")));

  // Casos inválidos (string)
  const invalidos = ["2,25", "1.000,00", "1,000.00", "abc", ""];

  for (const valor of invalidos) {
    try {
      MonetarioVO.create(valor as any);
      console.error("❌ Não deveria aceitar:", valor);
    } catch {
      console.log("✔️ Rejeitado corretamente:", JSON.stringify(valor));
    }
  }

  // Casos inválidos (numéricos)
  const invalidNumbers = [NaN, Infinity, -Infinity];

  for (const valor of invalidNumbers) {
    try {
      MonetarioVO.create(valor as any);
      console.error("❌ Não deveria aceitar:", valor);
    } catch {
      console.log("✔️ Rejeitado corretamente:", String(valor));
    }
  }

  // Divisão por zero
  try {
    v1.divide(0);
    console.error("❌ Não deveria dividir por zero");
  } catch {
    console.log("✔️ Divisão por zero rejeitada");
  }

  console.log();
}
