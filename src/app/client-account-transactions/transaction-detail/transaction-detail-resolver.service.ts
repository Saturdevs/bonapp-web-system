import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Transaction,
  TransactionService
} from '../../../shared';

@Injectable()
export class TransactionDetailResolverService implements Resolve<Transaction> {

  constructor(private _transactionService: TransactionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction> {
    let idTransaction = route.params['idTransaction'];
    return this._transactionService.getTransaction(idTransaction);
  }

}
