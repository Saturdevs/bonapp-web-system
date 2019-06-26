import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PaymentType, PaymentTypeService } from '../../../shared';
import { Observable } from 'rxjs';

@Injectable()
export class PaymentTypeAvailableResolverService implements Resolve<PaymentType[]> {

  constructor(private _paymentTypeService: PaymentTypeService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<PaymentType[]> {
    return this._paymentTypeService.getAvailables();
  }

}
