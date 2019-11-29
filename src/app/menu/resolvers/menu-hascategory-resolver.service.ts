import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Category,
  MenuService
} from '../../../shared/index';

@Injectable({
  providedIn: 'root'
})
export class MenuHascategoryResolverService implements Resolve<Category> {

  constructor(private _menuService: MenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category> {
    let id = route.params['id'];
    return this._menuService.hasAtLeastOneCategory(id);
  }
}
