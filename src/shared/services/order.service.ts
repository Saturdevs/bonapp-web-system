import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Order, UsersInOrder, ProductsInUserOrder } from '../models';
import { OrderStatus, Constants } from '../enums';

@Injectable()
export class OrderService {

  constructor(
    private apiService: ApiService
  ) { }
  
  public getEmployeeWhoAddedId(): string {
    return localStorage.getItem('employeeWhoAddedId');
  }

  public setEmployeeWhoAddedId(value: string) {
    localStorage.setItem('employeeWhoAddedId', value);
  }

  public createOrder(tableNumber: number, orderType: string): Order {
    let order = new Order();
    order.type = orderType;
    order.table = tableNumber;
    order.status = OrderStatus.OPEN;
    order.users = new Array<UsersInOrder>();
    order.users[0] = new UsersInOrder();
    order.users[0].username = Constants.BONAPP_WEB_USER;
    order.users[0].owner = true;
    order.users[0].products = new Array<ProductsInUserOrder>();
    order.users[0].products = [];
    order.app = false;
    return order;
  }

  getAll(): Observable<Order[]> {
    return this.apiService.get('/order')
           .map(data => data.orders)
           .catch(this.handleError);
  }

  getOrder(idOrder): Observable<Order> {
        return this.apiService.get(`/order/${idOrder}`)
            .map(data => data.order);
  }

  getLastOrder(): Observable<Order> {
        return this.apiService.get(`/order/lastOrder`)
                .map(data => data.order)
                .catch(this.handleError);
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

  //Se usaba en el order close component. Se cambio por updateOrderPayments()
  //Loren - 05/07/20
  /* closeOrder(order) {
    return this.apiService.put(`/order/close/${order._id}`, order)
      .map(data => data.order)
      .catch(this.handleError);
  } */

  updateOrderPayments(order) {
    return this.apiService.put(`/order`, order)
      .map(data => data.order)
      .catch(this.handleError);
  }

  updateOrder(order){
    return this.apiService.put(`/order/${order._id}`, order)
            .map(data => data.order)
            .catch(this.handleError);
  }

  /**
   * Agrega los productos para el usuario en el pedido correspondiente. Los productos, usuario, pedido y 
   * total del pedido se envian en el objeto data.
   * @param data {products: productsInPreOrder, total: totalToConfirm, username: username, order: currentOrder}
   */
  updateProductsOrder(data) {
    return this.apiService.put(`/order/products`, data)
      .map(data => data.order)
      .catch(this.handleError);
  }

  /**
   * Elimina un producto del array de productos de un usuario para un pedido dado.
   * @param data { productToRemove: productToRemove, order: currentOrder, username: username }
   */
  deleteProductOrder(data) {
    return this.apiService.put(`/order/products/delete`, data)
      .map(data => data.order)
      .catch(this.handleError);
  }

  saveOrder(order: Order){
    return this.apiService.post('/order', order)
          .map(data => data.order)
          .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }

}
