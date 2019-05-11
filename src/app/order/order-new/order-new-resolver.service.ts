import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Order } from '../../../shared/models/order';
import { OrderService } from '../../../shared/services/order.service';

@Injectable()
export class OrderNewResolverService implements Resolve<Order>{

  constructor(private _orderService: OrderService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
    let tableNumber = route.params['tableNumber'];
    return this._orderService.getOrderOpenByTable(tableNumber);
  }

}
