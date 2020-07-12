import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private apiService: ApiService) { }

  addPushSubscriber(sub: any) {
    return this.apiService.post('/notification', sub)
      .map(data => data.subscription)
      .catch(this.handleError);
  }

  send(notification) {
    return this.apiService.post('/notification/send', notification)
      .map(data => data.notificationsSent)
      .catch(this.handleError);
  }

  getAllTypes() {
    return this.apiService.get('/notification/types')
      .map(data => data.notificationTypes)
      .catch(this.handleError);
  }

  getNonReadNotifications(){
    return this.apiService.get('/notification/nonRead')
      .map(data => data.notificaions)
      .catch(this.handleError);
  }

  updateNotification(notification){
    return this.apiService.put(`/notification/${notification._id}`,notification)
      .map(data => data.notification)
      .catch(this.handleError);
  }
  
  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}
