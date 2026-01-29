import { DateTime } from "luxon";
import { DataHoraVO } from "../../VOs/DataVO/DataHoraVO";

export function TestaDataHoraVO() {
  console.log("===== TestaDataHoraVO =====");
  console.log("Zona da máquina:", DateTime.local().zoneName);

  const data1 = DataHoraVO.create("2023-06-15");
  const data2 = DataHoraVO.create("2024-06-15T00:00");
  const data3 = DataHoraVO.create(new Date());

  console.log("Data 1 UTC:", data1.toString());
  console.log("Data 1 SP:", data1.toString("America/Sao_Paulo"));
  console.log("Data 2 UTC:", data2.toString());
  console.log("Data 2 Dublin:", data2.toString("Europe/Dublin"));
  console.log("Data 3 UTC:", data3.toString());

  const formatada = data3.print("dd 'de' LLLL 'de' yyyy HH:mm", {
    zone: "America/Sao_Paulo",
    locale: "pt-BR",
  });

  console.log("Data 3 formatada:", formatada);

  console.log("Dias entre:", data1.daysBetween(data2));
  console.log("data1 isBefore data2?", data1.isBefore(data2));
  console.log("data2 isAfter data1?", data2.isAfter(data1));
  console.log("data1 isEqual to 2023-06-15?", data1.isEqual(DataHoraVO.create("2023-06-15")));

  // Casos inválidos
  const invalidos = ["15-06-2023", "2023/06/15", "2023-13-01", "abc"];

  for (const valor of invalidos) {
    try {
      DataHoraVO.create(valor as any);
      console.error("❌ Não deveria aceitar:", valor);
    } catch {
      console.log("✔️ Rejeitado corretamente:", valor);
    }
  }

  console.log();
}
