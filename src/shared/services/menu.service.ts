import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Menu } from '../models/menu';

@Injectable()
export class MenuService {  

  constructor(
    private apiService: ApiService
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

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }
}