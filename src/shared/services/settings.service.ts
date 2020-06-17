import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Settings> {
    return this.apiService.get('/settings')
      .map(data => data.settings)
      .catch(this.handleError);
  }


  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }

}
