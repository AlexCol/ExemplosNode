import { EmailVO } from "../../VOs/EmailVO/EmailVO";

export function TestaEmailVO() {
  console.log("===== TestaEmailVO =====");

  // Casos válidos
  const email1 = new EmailVO("Teste@Email.com");
  const email2 = new EmailVO("  user.name+tag@gmail.com ");

  console.log("Email 1:", email1.toString()); // teste@email.com
  console.log("Email 2:", email2.toString()); // user.name+tag@gmail.com
  console.log("teste@email.com Equals to Email1?", email1.equals(new EmailVO("teste@email.com"))); // true

  // Casos inválidos
  const invalidos = ["", "   ", "email", "email@", "@email.com", "email@email", "email@.com", "email@com."];

  for (const valor of invalidos) {
    try {
      new EmailVO(valor as any);
      console.error("❌ Não deveria aceitar:", valor);
    } catch (err) {
      console.log("✔️ Rejeitado corretamente:", JSON.stringify(valor));
    }
  }

  console.log();
}
