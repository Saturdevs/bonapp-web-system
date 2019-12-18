import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Product } from '../models/product';
import { OrderService } from './order.service';

@Injectable()
export class ProductService {
  didValidate: boolean = false;
  ordersWithCurrentMenu: any[];
  orders: any[];

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Product[]> {
    return this.apiService.get('/product')
      .map(data => data.products)
      .catch(this.handleError);
  }

  getProduct(idProduct): Observable<Product> {
    return this.apiService.get(`/product/${idProduct}`)
      .map(data => data.product)
      .catch(this.handleError);
  }

  getProductsByCategory(idCategory) {
    return this.apiService.get(`/product/category/${idCategory}`)
      .map(data => data.products)
      .catch(this.handleError);
  }

  getProductsAvailablesByCategory(idCategory){
    return this.apiService.get(`/product/availables/category/${idCategory}`)
      .map(data => data.products)
      .catch(this.handleError);
  }
  
  updateProduct(product) {
    return this.apiService.put(`/product/${product._id}`, product)
      .map(data => data.product)
      .catch(this.handleError);
  }

  updatePrice(data) {
    return this.apiService.put(`/product/updatePrice`, data)
      .map(data => data.products)
      .catch(this.handleError);
  }

  deleteProduct(idProduct) {
    return this.apiService.delete(`/product/${idProduct}`)
      .map(data => data.product)
      .catch(this.handleError);
  }

  saveProduct(product) {
    return this.apiService.post('/product', product)
      .map(data => data.product)
      .catch(this.handleError);
  }

  existInAnOrder(idProduct) {
    return this.apiService.get(`/product/existInAnOrder/${idProduct}`)
      .map(data => data.order)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }
}