import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<User[]> {
    return this.apiService.get('/user')
      .map(data => data.users)
      .catch(this.handleError);
  }

  getUser(userId): Observable<User> {
    return this.apiService.get(`/user/${userId}`)
      .map(data => data.user);
  }

  updateUser(user) {
    return this.apiService.put(`/user/${user._id}`, user)
      .map(data => data.user)
      .catch(this.handleError);
  }

  deleteUser(userId) {
    return this.apiService.delete(`/user/${userId}`)
      .map(data => data.user)
      .catch(this.handleError);
  }

  saveUser(user) {
    return this.apiService.post('/user', user)
      .map(data => data.user)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }


}
