import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  readonly VAPID_PUBLIC_KEY = "BFXG3OYw9d3Nsd-h8yKWxKI0ok4ISyjtIOpqRBOOIy_bkBnP6QbCEzaN9cu-ac3yJFaduuqFvcFWvXrj9FB-t3E";

  constructor(
    private apiService: ApiService,
    private swPush: SwPush
  ) { }

  public get subscriptionId(): string {
    return localStorage.getItem('subscriptionId') ? localStorage.getItem('subscriptionId') : null;
  }

  public set subscriptionId(value: string) {
    localStorage.setItem('subscriptionId', value);
  }

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

  getNonReadNotifications() {
    return this.apiService.get('/notification/nonRead')
      .map(data => data.notificaions)
      .catch(this.handleError);
  }

  updateNotification(notification) {
    return this.apiService.put(`/notification/${notification._id}`, notification)
      .map(data => data.notification)
      .catch(this.handleError);
  }

  deleteSubscription(): void {    
    if (!isNullOrUndefined(this.subscriptionId)) {      
      this.apiService.delete(`/notification/${this.subscriptionId}`)
        .subscribe(data => {
          let subscription = data.subscription;          
          localStorage.removeItem('subscriptionId');                    
        },
          err => {
            this.handleError(err);
          }
        )
    }
  }

  public async subscribeToNotifications() {
    try {
      if (!isNullOrUndefined(this.subscriptionId)) {        
        this.deleteSubscription();
      }      
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      });
      this.addPushSubscriber(sub).subscribe(
        res => {
          this.subscriptionId = res._id;
        },
        err => {
          console.log(err);
        });
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }
}
