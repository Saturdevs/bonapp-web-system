import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Menu } from '../../../shared/models/menu';
import { MenuService } from '../../../shared/services/menu.service';

@Injectable()
export class MenuModifyResolverService implements Resolve<Menu> {

  constructor(private _menuService: MenuService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Menu> {
    let id = route.params['id'];
    return this._menuService.getMenu(id);
  }

}
