import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Order, OrderService } from '../../../shared/index';

@Injectable({
  providedIn: 'root'
})
export class OrderResolverService implements Resolve<Order[]> {

  constructor(private _orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order[]> {
    return this._orderService.getAll();
  }
}
