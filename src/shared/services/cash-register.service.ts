import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { CashRegister } from '../models/cash-register';

@Injectable()
export class CashRegisterService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  getAll(): Observable<CashRegister[]> {
    return this.apiService.get('/cashRegister')
      .map(data => data.cashRegisters)
      .catch(this.handleError);
  }

  getAvailables(): Observable<CashRegister[]> {
    return this.apiService.get('/cashRegister/availables')
      .map(data => data.cashRegisters)
      .catch(this.handleError);
  }

  getCashRegister(idCashRegister): Observable<CashRegister> {
    return this.apiService.get(`/cashRegister/${idCashRegister}`)
      .map(data => data.cashRegister);
  }

  updateCashRegister(cashRegister) {
    return this.apiService.put(`/cashRegister/${cashRegister._id}`, cashRegister)
      .map(data => data.cashRegister)
      .catch(this.handleError);
  }

  deleteCashRegister(idCashRegister) {
    return this.apiService.delete(`/cashRegister/${idCashRegister}`)
      .map(data => data.cashRegister)
      .catch(this.handleError);
  }

  saveCashRegister(cashRegister) {
    return this.apiService.post('/cashRegister', cashRegister)
      .map(data => data.cashRegister)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

}
