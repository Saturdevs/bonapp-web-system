import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Injectable()
export class PaymentTypeResolverService implements Resolve<PaymentType[]> {

  constructor(private _paymentTypeService: PaymentTypeService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<PaymentType[]> {
    return this._paymentTypeService.getAvailables();
  }

}
