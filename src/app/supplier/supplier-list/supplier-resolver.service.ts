import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Supplier,
  SupplierService
} from '../../../shared';

@Injectable()
export class SupplierResolverService implements Resolve<Supplier[]> {

  constructor(private _supplierService: SupplierService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Supplier[]> {
    return this._supplierService.getAll();
  }

}
