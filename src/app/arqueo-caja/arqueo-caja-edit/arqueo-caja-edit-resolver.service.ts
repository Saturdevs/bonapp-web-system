import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  ArqueoCaja,
  ArqueoCajaService
} from '../../../shared/index';

@Injectable()
export class ArqueoCajaEditResolverService implements Resolve<ArqueoCaja> {

  constructor(private _arqueoCajaService: ArqueoCajaService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ArqueoCaja> {
    let id = route.params['id'];
    return this._arqueoCajaService.getArqueo(id);
  }
}
