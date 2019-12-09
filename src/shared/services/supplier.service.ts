import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Supplier } from '../models/supplier';

@Injectable()
export class SupplierService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Supplier[]> {
    return this.apiService.get('/supplier')
      .map(data => data.suppliers)
      .catch(this.handleError);
  }

  getSupplier(idSupplier): Observable<Supplier> {
    return this.apiService.get(`/supplier/${idSupplier}`)
      .map(data => data.supplier);
  }

  updateSupplier(supplier) {
    return this.apiService.put(`/supplier/${supplier._id}`, supplier)
      .map(data => data.menu)
      .catch(this.handleError);
  }

  deleteSupplier(idSupplier) {
    return this.apiService.delete(`/supplier/${idSupplier}`)
      .map(data => data.supplier)
      .catch(this.handleError);
  }

  saveSupplier(supplier) {
    return this.apiService.post('/supplier', supplier)
      .map(data => data.supplier)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }

}
