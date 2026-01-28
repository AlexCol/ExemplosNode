import Decimal from 'decimal.js';
import InvalidValueObjectError from '../VOError/InvalidValueObjectError';
import { BaseVO } from '../BaseVO';

export class MonetarioVO extends BaseVO {
  private readonly value: Decimal;

  constructor(valor: string | number | Decimal) {
    super();
    let decimal: Decimal;

    if (valor instanceof Decimal) {
      decimal = valor;
    } else if (typeof valor === 'number') {
      decimal = new Decimal(valor);
    } else {
      decimal = this.parseString(valor);
    }

    if (!MonetarioVO.validarValor(decimal)) {
      throw new InvalidValueObjectError('Valor monetário inválido.');
    }

    this.value = decimal;
  }

  /************************************************************/
  /* Operações matemáticas                                    */
  /************************************************************/

  add(outro: MonetarioVO): MonetarioVO {
    return new MonetarioVO(this.value.plus(outro.value));
  }

  subtract(outro: MonetarioVO): MonetarioVO {
    return new MonetarioVO(this.value.minus(outro.value));
  }

  multiply(fator: number | string | Decimal): MonetarioVO {
    return new MonetarioVO(this.value.times(fator));
  }

  divide(divisor: number | string | Decimal): MonetarioVO {
    if (new Decimal(divisor).isZero()) {
      throw new InvalidValueObjectError('Divisão por zero.');
    }
    return new MonetarioVO(this.value.dividedBy(divisor));
  }

  /************************************************************/
  /* Retorna um novo MonetarioVO com escala definida.         */
  /* Útil para fronteiras: persistência, exibição, cobrança.  */
  /************************************************************/
  withScale(
    casas: number,
    rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP,
  ): MonetarioVO {
    return new MonetarioVO(this.value.toDecimalPlaces(casas, rounding));
  }

  /************************************************************/
  /* Uso apenas para exibição.                                */
  /************************************************************/
  getValue(): Decimal {
    //decimal é 'cuspido' como string ao converter para JSON, isso é da biblioteca mesmo, não um bug
    return this.value;
  }

  print(
    casas = 2,
    decimalSeparator: '.' | ',' = '.',
    rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP,
  ): string {
    let str = this.value.toDecimalPlaces(casas, rounding).toFixed(casas);

    if (decimalSeparator === ',') {
      str = str.replace('.', ',');
    }

    return str;
  }

  printCurrency(
    locale: string,
    currency: string,
    options?: Intl.NumberFormatOptions,
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(this.value.toNumber());
  }

  /************************************************************/
  /* Apenas para integração ou exibição.                      */
  /* Nunca usar para cálculos financeiros.                    */
  /************************************************************/
  toNumber(): number {
    return this.value.toNumber();
  }

  toString(): string {
    return this.value.toString();
  }

  /************************************************************/
  /* Comparação                                               */
  /************************************************************/
  equals(outro: MonetarioVO): boolean {
    return this.value.equals(outro.value);
  }

  greaterThan(outro: MonetarioVO): boolean {
    return this.value.greaterThan(outro.value);
  }

  lessThan(outro: MonetarioVO): boolean {
    return this.value.lessThan(outro.value);
  }

  /************************************************************/
  /* Metodos Privados                                         */
  /************************************************************/
  private static validarValor(valor: Decimal): boolean {
    return valor.isFinite() && !valor.isNaN();
  }

  private parseString(valor: string): Decimal {
    const normalized = valor.trim();

    //formato canônico: apenas dígitos, opcionalmente com ponto decimal
    if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
      throw new InvalidValueObjectError(`Formato monetário inválido: ${valor}`);
    }

    return new Decimal(normalized);
  }
}
