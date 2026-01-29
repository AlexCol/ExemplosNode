import { EmailVO } from "../../VOs/EmailVO/EmailVO";

export function TestaEmailVO() {
  console.log("===== TestaEmailVO =====");

  // Casos válidos
  const email1 = EmailVO.create("Teste@Email.com");
  const email2 = EmailVO.create("  user.name+tag@gmail.com ");

  console.log("Email 1:", email1.toString()); // teste@email.com
  console.log("Email 2:", email2.toString()); // user.name+tag@gmail.com
  console.log("teste@email.com Equals to Email1?", email1.equals(EmailVO.create("teste@email.com"))); // true

  // Casos inválidos
  const invalidos = ["", "   ", "email", "email@", "@email.com", "email@email", "email@.com", "email@com."];

  for (const valor of invalidos) {
    try {
      EmailVO.create(valor as any);
      console.error("❌ Não deveria aceitar:", valor);
    } catch (err) {
      console.log("✔️ Rejeitado corretamente:", JSON.stringify(valor));
    }
  }

  console.log();
}
