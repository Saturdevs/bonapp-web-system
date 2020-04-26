import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dailyMenuAvailable'
})
export class DailyMenuAvailablePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? 'Si' : 'No';
  }

}
