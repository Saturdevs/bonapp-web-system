import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Supplier } from '../../../shared/models/supplier';
import { SupplierService } from '../../../shared/services/supplier.service';

@Injectable()
export class SupplierResolverService implements Resolve<Supplier[]> {

  constructor(private _supplierService: SupplierService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Supplier[]> {
    return this._supplierService.getAll();
  }

}
