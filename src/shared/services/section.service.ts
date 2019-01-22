import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Section } from '../models/section';

@Injectable()
export class SectionService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Section[]> {
    return this.apiService.get('/section')
           .map(data => data.sections)
           .catch(this.handleError);
  }

  getSection(idSection): Observable<Section> {
        return this.apiService.get(`/section/${idSection}`)
            .map(data => data.section);
  }

  updateSection(section){
    return this.apiService.put(`/section/${section._id}`, section)
            .map(data => data.section)
            .catch(this.handleError);
  }

  deleteSection(idSection){
    return this.apiService.delete(`/section/${idSection}`)
           .map(data =>data.section)
           .catch(this.handleError);
  }

  saveSection(section){
    return this.apiService.post('/section', section)
          .map(data => data.section)
          .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
