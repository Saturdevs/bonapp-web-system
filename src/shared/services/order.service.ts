import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Order, ProductsInUserOrder, UsersInOrder, UserMin } from '../models';
import { isNullOrUndefined } from 'util';

@Injectable()
export class OrderService {

  constructor(
    private apiService: ApiService
  ) { }
  
  getAll(): Observable<Order[]> {
    return this.apiService.get('/order')
           .map(data => data.orders)
           .catch(this.handleError);
  }

  getOrder(idOrder): Observable<Order> {
        return this.apiService.get(`/order/${idOrder}`)
            .map(data => data.order);
  }

  getOrderOpenByTable(tableNumber): Observable<Order> {
    return this.apiService.get(`/order/status/${tableNumber}?open=Open`)
          .map(data => data.order)
          .catch(this.handleError);
  }

  getOrdersByTable(idTable) {
    return this.apiService.get(`/order/section/${idTable}`)
           .map(data => data.orders)
           .catch(this.handleError);
  }

  closeOrder(order) {
    return this.apiService.put(`/order/close/${order._id}`, order)
      .map(data => data.order)
      .catch(this.handleError);
  }

  updateOrder(order){
    return this.apiService.put(`/order/${order._id}`, order)
            .map(data => data.order)
            .catch(this.handleError);
  }

  updateProductsOrder(order) {
    return this.apiService.put(`/order/products`, order)
      .map(data => data.order)
      .catch(this.handleError);
  }

  deleteOrder(idOrder){
    return this.apiService.delete(`/order/${idOrder}`)
           .map(data =>data.order)
           .catch(this.handleError);
  }

  saveOrder(order){
    return this.apiService.post('/order', order)
          .map(data => data.order)
          .catch(this.handleError);
  }

  unSetTable(tableNumber) {
    return this.apiService.put(`/order/unsettable/${tableNumber}`)
            .map(data =>data.table)
            .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }

}
