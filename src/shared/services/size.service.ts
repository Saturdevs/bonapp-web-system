import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Size } from '../models/size';

@Injectable()
export class SizeService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Size[]> {
    return this.apiService.get('/size')
      .map(data => data.sizes)
      .catch(this.handleError);
  }

  getSize(idSize): Observable<Size> {
    return this.apiService.get(`/size/${idSize}`)
      .map(data => data.size);
  }

  updateSize(size) {
    return this.apiService.put(`/size/${size._id}`, size)
      .map(data => data.size)
      .catch(this.handleError);
  }

  deleteSize(idSize) {
    return this.apiService.delete(`/size/${idSize}`)
      .map(data => data.size)
      .catch(this.handleError);
  }

  saveSize(size) {
    return this.apiService.post('/size', size)
      .map(data => data.size)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }

}
