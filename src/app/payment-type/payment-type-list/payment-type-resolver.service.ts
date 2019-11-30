import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  PaymentType,
  PaymentTypeService
} from '../../../shared';

@Injectable()
export class PaymentTypeResolverService implements Resolve<PaymentType[]> {

  constructor(private _paymentTypeService: PaymentTypeService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<PaymentType[]> {
    return this._paymentTypeService.getAll();
  }

}
