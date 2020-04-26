import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  UserRole,
  UserRoleService
} from '../../../shared/index';

@Injectable({
  providedIn: 'root'
})
export class UserRolesResolverService implements Resolve<UserRole[]> {

  constructor(private _userRoleService: UserRoleService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<UserRole[]> {
    return this._userRoleService.getAll();
  }
}
