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
import { CashFlow } from '../models/cash-flow';

@Injectable()
export class CashFlowService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<CashFlow[]> {
    return this.apiService.get('/cashFlow')
      .map(data => data.cashFlows)
      .catch(this.handleError);
  }

  getCashFlow(idCashFlow): Observable<CashFlow> {
    return this.apiService.get(`/cashFlow/${idCashFlow}`)
      .map(data => data.cashFlow);
  }

  deleteCashFlow(idCashFlow) {
    return this.apiService.delete(`/cashFlow/${idCashFlow}`)
      .map(data => data.cashFlow)
      .catch(this.handleError);
  }

  saveCashFlow(cashFlow) {
    return this.apiService.post('/cashFlow', cashFlow)
      .map(data => data.cashFlow)
      .catch(this.handleError);
  }

  logicalDeleteCashFlow(idCashFlow) {
    return this.apiService.put(`/cashFlow/logicalDelete/${idCashFlow}`)
      .map(data => data.message)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

}
