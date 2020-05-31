import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Param } from '../models/param';

@Injectable({
  providedIn: 'root'
})
export class ParamService {
  private _params: Array<Param>;

  constructor(
    private apiService: ApiService    
  ) { }

  public get params(): Array<Param> {
    return this._params;
  }

  public set params(value: Array<Param>) {
    this._params = value;
  }

  getAll(): Observable<Param[]> {
    return this.apiService.get('/param/')
      .map(data => data.params)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {    
    return Observable.throw(err);
  }
}
