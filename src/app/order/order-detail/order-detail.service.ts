import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { OrderService, Order } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService implements Resolve<Order> {

  constructor(private _orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {    
    let id = route.params['id'];
    return this._orderService.getOrder(id);
  }
}
