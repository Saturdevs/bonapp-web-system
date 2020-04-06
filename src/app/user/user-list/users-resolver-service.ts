import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  UserService,
  User
} from '../../../shared';

@Injectable()
export class UsersResolverService implements Resolve<User[]> {

  constructor(private _userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<User[]> {
    return this._userService.getAll();
  }

}
