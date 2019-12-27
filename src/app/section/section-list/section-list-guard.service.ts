import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router'

import { SectionListComponent } from './section-list.component'
import { TableService } from '../../../shared';

@Injectable({
  providedIn: 'root'
})
export class SectionListGuardService implements CanDeactivate<SectionListComponent> {

  constructor(private _tableService: TableService) { }

  canDeactivate(component: SectionListComponent): boolean {
    if (component.settingsActive && (this._tableService.addedTables.length !== 0 || this._tableService.updatedTables.length !== 0)) {
      return confirm('¿Desea abandonar la página sin guardar los cambios?');
    }
    return true;
  }
}
