import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Product,
  CategoryService
} from '../../../shared/index';

@Injectable({
  providedIn: 'root'
})
export class CategoryHasproductResolverService implements Resolve<Product> {

  constructor(private _categoryService: CategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    let id = route.params['id'];
    return this._categoryService.hasAtLeastOneProduct(id);
  }
}
