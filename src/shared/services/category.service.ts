import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {  

  constructor(
    private apiService: ApiService
  ) {}

  getAll(): Observable<Category[]> {
    return this.apiService.get('/category')
           .map(data => data.categories)
           .catch(this.handleError);
  }

  getCategory(idCategory): Observable<Category> {
        return this.apiService.get(`/category/${idCategory}`)
            .map(data => data.category);
  }

  getCategoriesByMenu(idMenu) {
    return this.apiService.get(`/category/parent/${idMenu}`)
           .map(data => data.categories)
           .catch(this.handleError);
  }

  getCategoriesWithMenu(): Observable<Category[]> {
    return this.apiService.get('/category/category/withmenu')
           .map(data => data.categories)
           .catch(this.handleError);
  }

  updateCategory(category){
    return this.apiService.put(`/category/${category._id}`, category)
            .map(data => data.menu)
            .catch(this.handleError);
  }

  deleteCategory(idCategory){
    return this.apiService.delete(`/category/${idCategory}`)
           .map(data =>data.category)
           .catch(this.handleError);
  }

  saveCategory(category){
    return this.apiService.post('/category', category)
          .map(data => data.category)
          .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err.message);
  }
  
}