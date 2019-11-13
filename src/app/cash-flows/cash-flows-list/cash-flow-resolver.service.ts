import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  CashFlow,
  CashFlowService
} from '../../../shared/index';

@Injectable()
export class CashFlowResolverService implements Resolve<CashFlow[]> {

  constructor(private _cashFlowService: CashFlowService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CashFlow[]> {
    return this._cashFlowService.getAll();
  }

}