import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Menu } from '../models/menu';
import { CategoryService } from './category.service';

@Injectable()
export class MenuService {  
  didValidate: boolean = false;
  categoriesInMenu: any;

  constructor(
    private apiService: ApiService,
    private _categoryService : CategoryService
  ) {}

  getAll(): Observable<Menu[]> {
    return this.apiService.get('/menu')
           .map(data => data.menus)
           .catch(this.handleError);
  }

  updateMenu(menu){
    return this.apiService.put(`/menu/${menu._id}`, menu)
            .map(data => data.menu)
            .catch(this.handleError);
  }
  
  getMenu(idMenu): Observable<Menu> {
        return this.apiService.get(`/menu/${idMenu}`)
            .map(data => data.menu)
            .catch(this.handleError);
  }

  saveMenu(menu){
    return this.apiService.post('/menu', menu)
          .map(data => data.menu)
          .catch(this.handleError);
  }

  deleteMenu(idMenu){
        return this.apiService.delete(`/menu/${idMenu}`)
          .map(data =>data.menu)
          .catch(this.handleError)
  }

  hasCategory(idMenu): Observable<Menu>{
    return this.apiService.get(`/menu/hasCategory/${idMenu}`)
      .map(data => data.menu) 
      .catch(this.handleError)
  }

  async validateMenuBeforeChanges(idMenu){
    let categoriesInMenu = await this._categoryService.getCategoriesByMenu(idMenu)
      .toPromise();
      if (categoriesInMenu.length > 0) {
        return false
      } else {
        return true 
      }
}

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}