import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  UserService,
  User,
  UserRole,
  UserRoleService
} from '../../../shared';

@Injectable()
export class UsersNewResolverService implements Resolve<UserRole[]> {

  constructor(private _userRoleService: UserRoleService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<UserRole[]> {
    return this._userRoleService.getAll();
  }

}
