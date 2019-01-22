import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Category } from '../../../shared/models/category';
import { CategoryService } from '../../../shared/services/category.service';

@Injectable()
export class CategoryModifyResolverService implements Resolve<Category> {

  constructor(private _categoryService: CategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category> {
    let id = route.params['id'];
    return this._categoryService.getCategory(id);
  }

}
