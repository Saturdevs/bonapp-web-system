import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Client } from '../../../shared/models/client';
import { ClientService } from '../../../shared/services/client.service';

@Injectable()
export class ClientResolverService implements Resolve<Client[]> {

  constructor(private _clientService: ClientService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client[]> {
    return this._clientService.getAll();
  }

}
