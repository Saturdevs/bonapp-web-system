import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { UserRole } from '../models/userRole';
import { IUserRoleDTO, IRight } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(
    private apiService: ApiService    
  ) { }

  getAll(): Observable<UserRole[]> {
    return this.apiService.get('/userRole/withoutrights')
      .map(data => data.userRoles)
      .catch(this.handleError);
  }

  getUserRole(idUserRole): Observable<UserRole> {
    return this.apiService.get(`/userRole/withrightsbymenu/${idUserRole}`)
      .map(data => data.userRole)
      .catch(this.handleError);
  }

  updateUserRole(data: {userRole: IUserRoleDTO, rightsToEnable: Array<IRight>, rightsToDisable: Array<IRight>}) {
    return this.apiService.put(`/userRole/${data.userRole._id}`, data)
      .map(data => data.menu)
      .catch(this.handleError);
  }

  saveUserRole(userRole) {
    return this.apiService.post('/userRole', userRole)
      .map(data => data.userRole)
      .catch(this.handleError);
  }

  deleteUserRole(idUserRole) {
    return this.apiService.delete(`/userRole/${idUserRole}`)
      .map(data => data.userRole)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {    
    return Observable.throw(err);
  }
}
