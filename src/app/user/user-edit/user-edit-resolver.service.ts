import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  PaymentType,
  PaymentTypeService,
  UserService,
  User
} from '../../../shared';

@Injectable()
export class UserEditResolverService implements Resolve<User> {

  constructor(private _userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    let id = route.params['id'];
    return this._userService.getUser(id);
  }

}
