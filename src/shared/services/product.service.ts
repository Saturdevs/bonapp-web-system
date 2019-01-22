import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Product } from '../models/product';

@Injectable()
export class ProductService {  

  constructor(
    private apiService: ApiService,
  ) {}

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

  getProductsWithCategory(): Observable<Product[]> {
    return this.apiService.get('/product/product/withcategory')
           .map(data => data.products)
           .catch(this.handleError);
  }

  updateProduct(product){
    return this.apiService.put(`/product/${product._id}`, product)
            .map(data => data.product)
            .catch(this.handleError);
  }

  deleteProduct(idProduct){
    return this.apiService.delete(`/product/${idProduct}`)
           .map(data =>data.product)
           .catch(this.handleError);
  }

  saveProduct(product){
    return this.apiService.post('/product', product)
          .map(data => data.product)
          .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }
}