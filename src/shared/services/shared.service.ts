import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';

@Injectable()
export class SharedService {

  constructor(
    private apiService: ApiService
  ) { }

  validateName(collectionName, objectName){
    return this.apiService.post(`/validateName/${collectionName}/${objectName}`)
    .map(data => data.result)
    .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
