import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Size,
  SizeService
} from '../../../shared';

@Injectable()
export class SizeResolverService implements Resolve<Size[]> {

  constructor(private _sizeService: SizeService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<Size[]> {
    return this._sizeService.getAll();
  }

}
