import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CashRegister, CashRegisterService } from '../../../shared';
import { Observable } from 'rxjs';

@Injectable()
export class CashRegisterAvailablesResolverService implements Resolve<CashRegister[]> {

  constructor(private _cashRegisterService: CashRegisterService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CashRegister[]> {
    return this._cashRegisterService.getAvailables();
  }

}
