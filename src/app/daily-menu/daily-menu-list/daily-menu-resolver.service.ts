import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { DailyMenuService } from '../../../shared/services/daily-menu.service';
import { DailyMenu } from '../../../shared/models/dailyMenu';

@Injectable()
export class DailyMenuResolverService implements Resolve<DailyMenu[]> {

  constructor(private _dailyMenuService: DailyMenuService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<DailyMenu[]> {
    return this._dailyMenuService.getAll();
  }

}
