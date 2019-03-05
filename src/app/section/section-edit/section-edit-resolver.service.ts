import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Section } from '../../../shared/models/section';
import { SectionService } from '../../../shared/services/section.service';

@Injectable()
export class SectionEditResolverService implements Resolve<Section> {

  constructor(private _sectionService: SectionService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Section> {
    let id = route.params['id'];
    return this._sectionService.getSection(id);
  }

}
