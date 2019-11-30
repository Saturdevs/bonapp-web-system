import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  PaymentType,
  PaymentTypeService
} from '../../../shared';

@Injectable()
export class PaymentTypeEditResolverService implements Resolve<PaymentType> {

  constructor(private _paymentTypeService: PaymentTypeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaymentType> {
    let id = route.params['id'];
    return this._paymentTypeService.getPaymentType(id);
  }

}
