import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Table } from '../../../shared/models/table';
import { TableService } from '../../../shared/services/table.service';

@Injectable()
export class TableListResolverService implements Resolve<Table[]> {

  constructor(private _tableService: TableService) { }  

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Table[]> {
    let id = route.params['id'];
    console.log(id);
    return this._tableService.getTablesBySection(id);
  }

}
