import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyMenu } from '../models/dailyMenu';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DailyMenuService {
  
  constructor(private apiService: ApiService) { }

  getAll(): Observable<DailyMenu[]> {
    return this.apiService.get('/dailyMenu')
      .map(data => data.dailyMenus)
      .catch(this.handleError);
  }

  save(dailyMenu): Observable<DailyMenu[]>{
    return this.apiService.post('/dailyMenu',dailyMenu)
      .map(data => data.dailyMenu)
      .catch(this.handleError)
  }

  update(dailyMenu : DailyMenu):Observable<DailyMenu>{
    return this.apiService.put(`/dailyMenu/${dailyMenu._id}`, dailyMenu)
      .map(data => data.dailyMenu)
      .catch(this.handleError)
  }

  getDailyMenu(id): Observable<DailyMenu>{
    return this.apiService.get(`/dailyMenu/${id}`)
    .map(data => data.dailyMenu)
    .catch(this.handleError)
  }

  updateDates(dailyMenu: DailyMenu): Observable<DailyMenu[]>{
    let today = new Date();
    let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    today.setHours(23,59,59,99);
    tomorrow.setHours(23,59,59,99);
    if(dailyMenu.startDate <= today && dailyMenu.endDate <= tomorrow){
      dailyMenu.startDate = new Date(1990, 1, 1, 0, 0, 0, 0);
      dailyMenu.endDate = new Date(1990, 1, 2, 0, 0, 0, 0);
    }else{
      dailyMenu.startDate = today;
      dailyMenu.endDate = tomorrow;
    }
    return this.apiService.put(`/dailyMenu/${dailyMenu._id}`,dailyMenu)
      .map(data => data.dailyMenu)
      .catch(this.handleError)
  }
  
  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }
}
