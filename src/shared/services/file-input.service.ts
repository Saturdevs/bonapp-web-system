import { Injectable } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
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
export class FileInputService {  

  constructor(
    private apiService: ApiService
  ) {}

  saveFile(file){
    return this.apiService.post('/file', file)
          .map(data => data.file)
          .catch(err => {
            console.log(err.message);
            return Observable.throw(err.message);});
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }

  
}