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
export class UserRolesEditResolverService implements Resolve<UserRole> {

  constructor(private _userRoleService: UserRoleService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserRole> {
    let id = route.params['id'];
    return this._userRoleService.getUserRole(id);
  }
}
