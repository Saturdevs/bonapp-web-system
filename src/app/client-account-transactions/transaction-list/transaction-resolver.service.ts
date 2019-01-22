import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Transaction } from '../../../shared/models/transaction';
import { ClientService } from '../../../shared/services/client.service';

@Injectable()
export class TransactionResolverService implements Resolve<Transaction[]> {

  constructor(private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction[]> {
    return this._clientService.getTransactions();
  }

}
