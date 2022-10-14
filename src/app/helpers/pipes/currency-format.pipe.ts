import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): any {
    if (value) {
      return this.getMoneyStr(value, 0);
    }
    return value;
  }

  getMoneyStr(value: number, decimalDigit: number = 0) {
    if (value == 0) {
      return value;
    }
    const valueABS = Math.abs(value);

    const pow = Math.pow(10, decimalDigit);
    const val = Math.ceil(valueABS * pow) / pow;
    const s: string = val.toString();
    let s2 = '';
    let j = s.indexOf('.');
    if (j > -1) {
      s2 = s.substring(j);
    } else {
      j = s.length;
    }

    while (j > 3) {
      s2 = '.' + s.substring(j - 3, j) + s2;
      j -= 3;
    }
    s2 = s.substring(0, j) + s2;
    if (value < 0) {
      s2 = '- ' + s2;
    }
    return s2;
  }
}
