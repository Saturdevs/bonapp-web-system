import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Size,
  SizeService
} from '../../../shared';

@Injectable()
export class SizeEditResolverService implements Resolve<Size> {

  constructor(private _sizeService: SizeService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Size> {
    let id = route.params['id'];
    return this._sizeService.getSize(id);
  }
 
}
