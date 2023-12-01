import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'currencyFormatCop'
})
export class CurrencyCopPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) { }

  transform(value: number): string {
    let value_string = this.decimalPipe.transform(value, '1.2-2').toString();
    let subtraction = value_string.split('.'); 
    let part1 = subtraction[0];
    let residue = subtraction[1];
    part1 = part1.replace(',', '.');
    let return_data = part1
    if(Number(residue) > 0){
      return_data = part1+","+residue;
    }
    return return_data;
  }

}
