import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Product,
  ProductService
} from '../../../shared';

@Injectable()
export class ProductModifyResolverService implements Resolve<Product> {

  constructor(private _productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    let id = route.params['id'];
    return this._productService.getProduct(id);
  }

}
