import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Order, ProductsInUserOrder, UsersInOrder } from '../models';
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
          .map(data => data.orders[0])
          .catch(this.handleError);
  }

  getOrdersByTable(idTable) {
    return this.apiService.get(`/order/section/${idTable}`)
           .map(data => data.orders)
           .catch(this.handleError);
  }

  updateOrder(order){
    return this.apiService.put(`/order/${order._id}`, order)
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

  /**
   * Transforma el pedido recuperado de la base de datos en un objeto "Order" para utilizar en el front end
   * @param order pedido recuperado de la base de datos
   */
  transformOrderFromDbToBusiness(order:any):Order {
    let orderBusiness = new Order();
    let users = new Array<UsersInOrder>(); 

    order.users.forEach(user => {
      let usr = new UsersInOrder();
      let products = new Array<ProductsInUserOrder>();
      products = [];            

      user.products.forEach(product => {
        let prod = new ProductsInUserOrder();

        prod.product = product.product._id;
        prod.name = product.product.name;
        prod.options = product.options;
        prod.price = product.price;
        prod.size = isNullOrUndefined(product.size) ? null : product.size;
        prod.observations = product.observations;
        prod.quantity = product.quantity;
        prod.deleted = product.deleted;
        prod.deletedReason = isNullOrUndefined(product.deletedReason) ? null : product.deletedReason;

        products.push(prod);
      })

      usr.user = user.user._id;
      usr.name = user.user.name;
      usr.lastName = user.user.lastName;
      usr.userName = user.user.username;
      usr.products = products;
      usr.totalPerUser = user.totalPerUser;
      usr.payments = user.payments;
      usr.owner = user.owner;

      users.push(usr);
    });

    orderBusiness._id = order._id;
    orderBusiness.orderNumber = order.orderNumber;
    orderBusiness.type = order.type;
    orderBusiness.table = order.table;
    orderBusiness.cashRegister = order.cashRegister;
    orderBusiness.waiter = order.waiter;
    orderBusiness.status = order.status;
    orderBusiness.app = order.app;
    orderBusiness.users = users;
    orderBusiness.created_at = order.created_at;
    orderBusiness.sent_at = order.sent_at;
    orderBusiness.completed_at = order.completed_at;
    orderBusiness.discount = order.discount;    
    orderBusiness.totalPrice = order.totalPrice;

    return orderBusiness;
  }

  /**
   * Transforma el pedido recibido como parámetro en un objeto que puede ser almacenado en la base de datos.
   * @param order pedido creado en el sistema para almacenar en la base de datos
   */
  transformOrderFromBusinessToDb(order:Order):any {
    let ord : any;
    let users = new Array<any>();
    ord = {};
    users = [];

    order.users.forEach(user => {
      let usr : any;
      let products = new Array<any>();
      usr = {};
      products = [];

      user.products.forEach(product => {
        let prod : any;
        prod = {};

        prod.product = product.product;
        prod.options = product.options;
        prod.price = product.price;
        prod.size = product.size;
        prod.observations = product.observations;
        prod.quantity = product.quantity;
        prod.deleted = product.deleted;
        prod.deletedReason = product.deletedReason;

        products.push(prod);
      })

      usr.user = user.user;
      usr.products = products;
      usr.totalPerUser = user.totalPerUser;
      usr.payments = user.payments;
      usr.owner = user.owner;

      users.push(usr);
    })

    ord._id = order._id;
    ord.orderNumber = order.orderNumber;
    ord.type = order.type;
    ord.table = order.table;
    ord.cashRegister = isNullOrUndefined(order.cashRegister) ? null : order.cashRegister._id;
    ord.waiter = isNullOrUndefined(order.waiter) ? null : order.waiter._id;
    ord.status = order.status;
    ord.app = order.app;
    ord.users = users;
    ord.created_at = order.created_at;
    ord.sent_at = order.sent_at;
    ord.completed_at = order.completed_at;
    ord.discount = order.discount;
    ord.totalPrice = order.totalPrice;

    return ord;
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }

}
