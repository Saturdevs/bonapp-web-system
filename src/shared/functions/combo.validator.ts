import { AbstractControl } from '@angular/forms';

export class ComboValidators {
  static hasValue(c: AbstractControl): {[key: string]: boolean} | null {
    if (c.value === 'default') {
      return { 'notdefault': true };
    };
    return null;
  }
}