import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private _apiService: ApiService) { }

  getAll() : Observable<UserRole[]>{
    return this._apiService.get(`/userRole/withoutrights`)
      .map(data => data.userRoles)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}
