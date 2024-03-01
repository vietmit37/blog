import { formatISO } from 'date-fns';

export class Transformation {
  static mapDateToString(value?: Date): string {
    if (typeof value === 'string') {
      return value;
    }
    return formatISO(value);
  }

  static mapStringToNumber(value: any): any {
    const parsedValue = Number(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  static mapStringToBool(value: string): boolean {
    return value === 'true';
  }
}
