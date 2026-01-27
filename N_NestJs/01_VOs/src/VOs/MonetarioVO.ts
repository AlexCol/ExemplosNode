import Decimal from 'decimal.js';

export class MonetarioVO {
  private readonly valor: Decimal;

  constructor(valor: string | number | Decimal) {
    if (typeof valor === 'string') {
      valor = valor.replace(',', '.');
    }

    const decimal = new Decimal(valor);

    if (!MonetarioVO.validarValor(decimal)) {
      throw new Error('Valor monetário inválido.');
    }

    this.valor = decimal;
  }

  private static validarValor(valor: Decimal): boolean {
    return valor.isFinite() && !valor.isNaN();
  }

  /************************************************************/
  /* Operações matemáticas                                    */
  /************************************************************/

  add(outro: MonetarioVO): MonetarioVO {
    return new MonetarioVO(this.valor.plus(outro.valor));
  }

  subtract(outro: MonetarioVO): MonetarioVO {
    return new MonetarioVO(this.valor.minus(outro.valor));
  }

  multiply(fator: number | string | Decimal): MonetarioVO {
    return new MonetarioVO(this.valor.times(fator));
  }

  divide(divisor: number | string | Decimal): MonetarioVO {
    if (new Decimal(divisor).isZero()) {
      throw new Error('Divisão por zero.');
    }
    return new MonetarioVO(this.valor.dividedBy(divisor));
  }

  /************************************************************/
  /* Retorna um novo MonetarioVO com escala definida.         */
  /* Útil para fronteiras: persistência, exibição, cobrança.  */
  /************************************************************/
  withScale(
    casas: number,
    rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP,
  ): MonetarioVO {
    return new MonetarioVO(this.valor.toDecimalPlaces(casas, rounding));
  }

  /************************************************************/
  /* Uso apenas para exibição.                                */
  /************************************************************/
  print(
    casas = 2,
    decimalSeparator: '.' | ',' = '.',
    rounding: Decimal.Rounding = Decimal.ROUND_HALF_UP,
  ): string {
    let str = this.valor.toDecimalPlaces(casas, rounding).toFixed(casas);

    if (decimalSeparator === ',') {
      str = str.replace('.', ',');
    }

    return str;
  }

  /************************************************************/
  /* Apenas para integração ou exibição.                      */
  /* Nunca usar para cálculos financeiros.                    */
  /************************************************************/
  toNumber(): number {
    return this.valor.toNumber();
  }

  toString(): string {
    return this.valor.toString();
  }

  /************************************************************/
  /* Comparação                                               */
  /************************************************************/
  equals(outro: MonetarioVO): boolean {
    return this.valor.equals(outro.valor);
  }

  greaterThan(outro: MonetarioVO): boolean {
    return this.valor.greaterThan(outro.valor);
  }

  lessThan(outro: MonetarioVO): boolean {
    return this.valor.lessThan(outro.valor);
  }
}
