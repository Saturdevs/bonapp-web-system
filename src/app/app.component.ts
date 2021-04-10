import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
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
  UtilFunctions,
  ParamService,
  NotificationTypes,
  Notification,
  NotificationReadBy
} from '../shared/index';
import { isNullOrUndefined } from 'util';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Web Bar';
  subtitle: string = 'by Los Pibes';
  notifications: Array<Notification> = [];
  myDate: Date;
  currentUser: User;
  appMenus: Array<AppMenu> = [];
  public modalRef: BsModalRef;

  @ViewChild('orderModal') orderModal: TemplateRef<any>;
  currentNotificationToDisplay: any;

  constructor(
    private _socketService: SocketIoService,
    private toast: ToastService,
    private swPush: SwPush,
    private _notificationService: NotificationService,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private translate: TranslateService,
    private _parameterService: ParamService,
    private modalService: BsModalService
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
    // this.subscribeToNotificationsClick();
    this.getNewNotifications();
    this.getNonReadNotifications();
    this.getParams();
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (!localStorage.getItem('currentUser') || JSON.parse(localStorage.getItem('currentUser')) === {}) {
      this._notificationService.deleteSubscription();
    }
  }

  getParams() {
    this._parameterService.getAll().subscribe(
      params => {
        this._parameterService.params = params;
      }
    )
  }

  getTime(): void {
    this.myDate = new Date();
    setInterval(() => {
      this.myDate = new Date();
    }, 1000);
  };

  getNewNotifications() {
    this.swPush.messages.subscribe(notificationReceived => {
      this.getNonReadNotifications();
    })
  }

  getNonReadNotifications() {
    this._notificationService.getNonReadNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      })
  }

  subscribeToNotificationsClick() {
    this.swPush.notificationClicks.subscribe(notificationClick => {
      const notificationType = notificationClick.notification.data.notificationType;
      const data = notificationClick.notification.data;

      switch (notificationType) {
        case NotificationTypes.NewOrder:
          this._socketService.acceptOrder(data);
          this.showNewOrderNotificationModal(data);
          break;
        case NotificationTypes.TableOcuped:
          break;
        case NotificationTypes.WaiterCall:
          break;
        default:
          break;
      }
    })
  }

  showNewOrderNotificationModal(notification) {
    if (notification.notificationType === NotificationTypes.NewOrder) {
      this.currentNotificationToDisplay = notification;
      this.modalRef = this.modalService.show(this.orderModal, { backdrop: true, ignoreBackdropClick: true });
    }
    let newRead = new NotificationReadBy();
    newRead.readAt = new Date();

    notification.readBy = newRead;
    this._notificationService.updateNotification(notification)
      .subscribe(notificationUpdated => {
        console.log(notificationUpdated);
        this.getNonReadNotifications();
      });
  }

  closeNewOrderNotificationModal() {
    this.modalRef.hide();
    this.modalRef = null;
    this.currentNotificationToDisplay = null;
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigate(['/login']);
  }
}
