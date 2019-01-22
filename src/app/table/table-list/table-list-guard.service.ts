import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router'

import { TableListComponent } from './table-list.component'

@Injectable()
export class TableListGuardService implements CanDeactivate<TableListComponent> {

  constructor(private _router: Router) { }

  canDeactivate(component: TableListComponent): boolean {
    if(component.settingsActive && (component.addedTables.length !== 0 || component.deletedTables.length !== 0)) {
      return confirm('¿Desea abandonar la página sin guardar los cambios?');
    }
    return true;
  }

}
