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
import { ArqueoCaja } from '../models/arqueo-caja';

@Injectable()
export class ArqueoCajaService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<ArqueoCaja[]> {
    return this.apiService.get('/arqueo')
           .map(data => data.arqueos)
           .catch(this.handleError);
  }

  getArqueo(idArqueo): Observable<ArqueoCaja> {
        return this.apiService.get(`/arqueo/${idArqueo}`)
            .map(data => data.arqueo);
  }

  getArqueosByCashRegister(idCashRegister): Observable<ArqueoCaja[]> {
    return this.apiService.get(`/arqueo/${idCashRegister}/cashRegister`)
           .map(data => data.arqueos)
           .catch(this.handleError);
  }

  getArqueoOpenByCashRegister(idCashRegister): Observable<ArqueoCaja> {
    return this.apiService.get(`/arqueo/${idCashRegister}/cashRegister/open`)
           .map(data => data.arqueo)
           .catch(this.handleError);
  }

  getLastArqueoByCashRegister(idCashRegister) {
    return this.apiService.get(`/arqueo/${idCashRegister}/cashRegister/last`)
           .map(data => data.lastArqueo)
           .catch(this.handleError);
  }

  getCashMovementsByDate(idCashRegister, date) {
    return this.apiService.get(`/arqueo/cashMovements/${idCashRegister}?date=${date}`)
      .map(data => data)
      .catch(this.handleError);
  }

  updateArqueo(arqueo){
    console.log(arqueo)
    return this.apiService.put(`/arqueo/${arqueo._id}`, arqueo)
            .map(data => data.arqueo)
            .catch(this.handleError);
  }

  deleteArqueo(idArqueo){
    return this.apiService.delete(`/arqueo/${idArqueo}`)
           .map(data =>data.arqueo)
           .catch(this.handleError);
  }

  saveArqueo(arqueo){
    return this.apiService.post('/arqueo', arqueo)
          .map(data => data.arqueo)
          .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
