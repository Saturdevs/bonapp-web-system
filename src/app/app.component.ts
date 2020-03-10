import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { SwPush } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';

import {
  AuthenticationService,
  NotificationService,
  SocketIoService,
  User,
  AppMenu,
  UtilFunctions
} from '../shared/index';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY = "BFXG3OYw9d3Nsd-h8yKWxKI0ok4ISyjtIOpqRBOOIy_bkBnP6QbCEzaN9cu-ac3yJFaduuqFvcFWvXrj9FB-t3E";
  title: string = 'Web Bar';
  subtitle: string = 'by Los Pibes';
  myDate: Date;
  currentUser: User;
  appMenus: Array<AppMenu> = [];

  constructor(
    private _socketService: SocketIoService,
    private toast: ToastService,
    private swPush: SwPush,
    private _notificationService: NotificationService,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private translate: TranslateService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('es');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('es');
  }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        if (!isNullOrUndefined(this.currentUser)) {
          this.appMenus = UtilFunctions.getChildAPpMenus(this.currentUser, null);
        }
      }
    );

    this.getTime();

    this._socketService.waiterCall() //Se suscribe al observable que avisa cuando recibio el metodo callWaiter
      .subscribe(waiterCall => {
        let options = {
          timeOut: 0,
          closeButton: true,
          toastClass: 'opacity'
        };
        this.toast.success('Se requiere un mozo en la mesa ' + waiterCall.tableNumber, 'ATENCION:', options);
      });
  }

  getTime(): void {
    this.myDate = new Date();
    setInterval(() => {
      this.myDate = new Date();
    }, 1000);
  };

  subscribeToNotifications() {

    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => this._notificationService.addPushSubscriber(sub).subscribe())
      .catch(err => console.error("Could not subscribe to notifications", err));
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigate(['/login']);
  }
}
