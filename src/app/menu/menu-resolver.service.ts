import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Menu, 
  MenuService
} from '../../shared';

@Injectable()
export class MenuResolverService implements Resolve<Menu[]> {

  constructor(private _menuService: MenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu[]>{
    return this._menuService.getAll();
  }

}
