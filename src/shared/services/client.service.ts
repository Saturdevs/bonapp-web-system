import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Client } from '../models/client';
import { Transaction } from '../models/transaction';

@Injectable()
export class ClientService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Client[]> {
    return this.apiService.get('/client')
      .map(data => data.clients)
      .catch(this.handleError);
  }

  getWithCurrentAccountEnabled(): Observable<Client[]> {
    return this.apiService.get('/client/withCurrentAccountEnabled')
      .map(data => data.clients)
      .catch(this.handleError);
  }

  getClient(idClient): Observable<Client> {
    return this.apiService.get(`/client/${idClient}`)
      .map(data => data.client);
  }

  updateClient(client) {
    return this.apiService.put(`/client/${client._id}`, client)
      .map(data => data.menu)
      .catch(this.handleError);
  }

  deleteClient(idClient) {
    return this.apiService.delete(`/client/${idClient}`)
      .map(data => data.client)
      .catch(this.handleError);
  }

  saveClient(client) {
    return this.apiService.post('/client', client)
      .map(data => data.client)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

}