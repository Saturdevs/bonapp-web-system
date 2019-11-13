import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import {
  Category,
  CategoryService
} from '../../../shared/index';

@Injectable()
export class CategoryResolverService implements Resolve<Category[]> {

  constructor(private _categoryService: CategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]>{
    return this._categoryService.getAll();
  }

}
