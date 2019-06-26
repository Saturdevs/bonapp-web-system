import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { PaymentType } from '../models/payment-type';

@Injectable()
export class PaymentTypeService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<PaymentType[]> {
    return this.apiService.get('/paymentType')
           .map(data => data.paymentTypes)
           .catch(this.handleError);
  }

  getAvailables(): Observable<PaymentType[]> {
    return this.apiService.get('/paymentType/availables')
           .map(data => data.paymentTypes)
           .catch(this.handleError);
  }

  getDefault(): Observable<PaymentType> {
    return this.apiService.get('/paymentType/default')
           .map(data => data.paymentType)
           .catch(this.handleError);
  }

  getPaymentType(idPaymentType): Observable<PaymentType> {
        return this.apiService.get(`/paymentType/${idPaymentType}`)
            .map(data => data.paymentType);
  }

  updatePaymentType(paymentType){
    return this.apiService.put(`/paymentType/${paymentType._id}`, paymentType)
            .map(data => data.paymentType)
            .catch(this.handleError);
  }

  deletePaymentType(idPaymentType){
    return this.apiService.delete(`/paymentType/${idPaymentType}`)
           .map(data =>data.paymentType)
           .catch(this.handleError);
  }

  savePaymentType(paymentType){
    return this.apiService.post('/paymentType', paymentType)
          .map(data => data.paymentType)
          .catch(this.handleError);
  }

  unSetDefaultPaymentType(idPaymentType): Observable<any> {
    return this.apiService.put(`/paymentType/unSetDefaultPaymentType/${idPaymentType}`, {})
      .map(data => data)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
