import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private apiService: ApiService) { }

  addPushSubscriber(sub: any) {
    return this.apiService.post('/notification', sub);
  }

  send(notification) {
    return this.apiService.post('/notification/send', notification);
  }
}
