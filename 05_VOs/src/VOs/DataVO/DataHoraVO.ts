import { DateTime } from 'luxon';
import InvalidValueObjectError from '../VOError/InvalidValueObjectError';
import { BaseVO } from '../BaseVO';

//Lista com timezones
//https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

export class DataHoraVO extends BaseVO {
  private readonly value: DateTime;

  constructor(date: string | Date | DateTime) {
    super();
    const effectiveZone = 'UTC';

    if (date instanceof Date) {
      this.value = DateTime.fromJSDate(date, { zone: effectiveZone }).toUTC();
    } else if (date instanceof DateTime) {
      this.value = date.setZone(effectiveZone, { keepLocalTime: true }).toUTC();
    } else {
      this.value = this.convertFromString(date, effectiveZone);
    }

    if (!this.value.isValid) {
      throw new InvalidValueObjectError('Data/hora inválida.');
    }
  }

  /************************************************************/
  /* Exibição                                                 */
  /************************************************************/
  getValue(zone?: string) {
    return zone ? this.value.setZone(zone).toISO()! : this.value.toISO()!;
  }

  toString(zone?: string): string {
    return zone ? this.value.setZone(zone).toISO()! : this.value.toISO()!;
  }

  toDate(zone?: string): Date {
    return zone ? this.value.setZone(zone).toJSDate() : this.value.toJSDate();
  }

  toDateTime(zone?: string): DateTime {
    return zone ? this.value.setZone(zone) : this.value;
  }

  //lista de formatos: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  //lista de locales: https://github.com/ladjs/i18n-locales
  print(
    format: string,
    options?: {
      zone?: string;
      locale?: string;
    },
  ): string {
    let dt = this.value;

    if (options?.zone) {
      dt = dt.setZone(options.zone);
    }

    if (options?.locale) {
      dt = dt.setLocale(options.locale);
    }

    return dt.toFormat(format);
  }

  /************************************************************/
  /* Obter Zona                                               */
  /************************************************************/
  getZone(): string | null {
    return this.value.zoneName;
  }

  isValidZone(zone: string): boolean {
    return DateTime.local().setZone(zone).isValid;
  }

  /************************************************************/
  /* Comparação                                               */
  /************************************************************/
  compareTo(other: DataHoraVO): number {
    return this.value.toMillis() - other.value.toMillis();
  }

  daysBetween(other: DataHoraVO): number {
    return Math.abs(this.value.diff(other.value, 'days').days);
  }

  isBefore(other: DataHoraVO): boolean {
    return this.value < other.value;
  }

  isAfter(other: DataHoraVO): boolean {
    return this.value > other.value;
  }

  isEqual(other: DataHoraVO): boolean {
    return this.value.equals(other.value);
  }

  /************************************************************/
  /* Metodos Privados                                         */
  /************************************************************/
  private convertFromString(dateStr: string, zone: string): DateTime {
    //se vier em formato UTC com 'Z' no final, remove o 'Z'
    if (dateStr.endsWith('Z')) {
      dateStr = dateStr.slice(0, -1);
    }

    // Aceita ISO: yyyy-MM-dd ou yyyy-MM-ddTHH:mm[:ss]
    const isoDateTime =
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?)?$/;

    if (!isoDateTime.test(dateStr)) {
      throw new InvalidValueObjectError(
        'Formato de data/hora inválido. Use yyyy-MM-dd ou yyyy-MM-ddTHH:mm[:ss]',
      );
    }

    return DateTime.fromISO(dateStr, { zone }).toUTC();
  }
}
