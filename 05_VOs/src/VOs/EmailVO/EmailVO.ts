import { BaseVO } from "../BaseVO";
import InvalidValueObjectError from "../VOError/InvalidValueObjectError";

export class EmailVO extends BaseVO {
  private readonly value: string;

  private constructor(email: string) {
    super();
    this.value = email;
  }

  /************************************************************/
  /* Metodo Factory                                           */
  /************************************************************/
  static create(email: string): EmailVO {
    if (typeof email !== "string") {
      throw new InvalidValueObjectError("Email inválido.");
    }

    const normalized = email.trim().toLowerCase();

    if (!EmailVO.isValid(normalized)) {
      throw new InvalidValueObjectError("Email inválido.");
    }
    return new EmailVO(normalized);
  }

  /************************************************************/
  /* Exibição / Integração                                    */
  /************************************************************/
  toString(): string {
    return this.value;
  }

  getValue(): string {
    return this.value;
  }

  /************************************************************/
  /* Comparação                                               */
  /************************************************************/
  equals(other: EmailVO): boolean {
    return this.value === other.value;
  }

  /************************************************************/
  /* Validação                                                */
  /************************************************************/
  private static isValid(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  // exemplos que esse regex permite
  // válidos:
  /// john.doe@gmail.com
  /// john+newsletter@gmail.com
  /// user_name@empresa.com
  /// billing+2024@empresa.com.br
  /// contato@sub.dominio.co.uk
  /// a.b-c_d+e@dominio-legal.io
  //
  // inválidos:
  /// john@gmail                 // sem TLD
  /// john@.com                  // domínio inválido
  /// john@domain.c              // TLD muito curto
  /// john@@gmail.com            // dois @
  /// john gmail@gmail.com       // espaço
  /// "john.doe"@gmail.com       // aspas (RFC válido, mas intencionalmente bloqueado)
  /// john@[192.168.0.1]         // IP literal (bloqueado)
}
