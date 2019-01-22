import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Transaction } from '../../../shared/models/transaction';
import { ClientService } from '../../../shared/services/client.service';

@Injectable()
export class TransactionDetailResolverService implements Resolve<Transaction> {

  constructor(private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Transaction> {
    let idClient = route.params['idClient'];
    let idTransaction = route.params['idTransaction'];
    return this._clientService.getTransactionByClientById(idClient, idTransaction);
  }

}
