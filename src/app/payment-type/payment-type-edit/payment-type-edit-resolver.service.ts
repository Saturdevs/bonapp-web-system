import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Injectable()
export class PaymentTypeEditResolverService implements Resolve<PaymentType> {

  constructor(private _paymentTypeService: PaymentTypeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PaymentType> {
    let id = route.params['id'];
    return this._paymentTypeService.getPaymentType(id);
  }

}
