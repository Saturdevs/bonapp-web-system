import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Order,
  ProductService
} from '../../../shared/index';

@Injectable({
  providedIn: 'root'
})
export class ProductOrderResolverService implements Resolve<Order> {

  constructor(private _productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
    let id = route.params['id'];
    return this._productService.existInAnOrder(id);
  }
}
