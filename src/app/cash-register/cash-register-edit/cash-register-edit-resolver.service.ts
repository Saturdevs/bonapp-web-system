import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  CashRegister,
  CashRegisterService
} from '../../../shared/index';

@Injectable()
export class CashRegisterEditResolverService implements Resolve<CashRegister> {

  constructor(private _cashRegisterService: CashRegisterService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CashRegister> {
    let id = route.params['id'];
    return this._cashRegisterService.getCashRegister(id);
  }

}
