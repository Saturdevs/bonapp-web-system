import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  ArqueoCaja,
  ArqueoCajaService
} from '../../../shared/index';

@Injectable()
export class ArqueoCajaResolverService implements Resolve<ArqueoCaja[]> {

  constructor(private _arqueoService: ArqueoCajaService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ArqueoCaja[]> {
    return this._arqueoService.getAll();
  }

}
