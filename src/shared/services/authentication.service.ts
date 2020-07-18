import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private apiService: ApiService) {
    if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser')) !== {}) {
      console.log('current user from local')
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    } else {
      console.log('current user from session')
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    }
    console.log('curren user: ' + this.currentUserSubject.value)
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string, keepLoggedIn: Boolean) {
    console.log("KeepLoggedIn: " + keepLoggedIn)
    return this.apiService.post(`/user/signin`, { username, password })
      .map(data => {
        const user = data.user;
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          if (keepLoggedIn) {
            console.log('keep logged in')
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            console.log('not keep logged in')
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }

        return user;
      })
      .catch(this.handleError);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }
}
