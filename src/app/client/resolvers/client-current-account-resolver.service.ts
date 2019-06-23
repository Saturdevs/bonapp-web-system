import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Client, ClientService } from '../../../shared';
import { Observable } from 'rxjs';

@Injectable()
export class ClientCurrentAccountResolverService implements Resolve<Client[]> {

  constructor(private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client[]> {
    return this._clientService.getWithCurrentAccountEnabled();
  }

}
