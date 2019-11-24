import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Client,
  ClientService
} from '../../../shared';

@Injectable()
export class ClientEditResolverService implements Resolve<Client> {

  constructor(private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client> {
    let id = route.params['id'];
    return this._clientService.getClient(id);
  }
}
