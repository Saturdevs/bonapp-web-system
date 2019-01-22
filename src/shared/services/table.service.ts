import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Table } from '../models/table';

@Injectable()
export class TableService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Table[]> {
    return this.apiService.get('/table')
           .map(data => data.tables)
           .catch(this.handleError);
  }

  getTable(idTable): Observable<Table> {
        return this.apiService.get(`/table/${idTable}`)
            .map(data => data.table);
  }

  getTableByNumber(tableNumber): Observable<Table> {
    return this.apiService.get(`/table/number/${tableNumber}`)
        .map(data => data.table);
}

  getTablesBySection(idSection) {
    return this.apiService.get(`/table/section/${idSection}`)
           .map(data => data.tables)
           .catch(this.handleError);
  }

  updateTable(table){
    return this.apiService.put(`/table/${table._id}`, table)
            .map(data => data.table)
            .catch(this.handleError);
  }

  deleteTable(idTable){
    return this.apiService.delete(`/table/${idTable}`)
           .map(data =>data.table)
           .catch(this.handleError);
  }

  saveTable(table){
    return this.apiService.post('/table', table)
          .map(data => data.table)
          .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
