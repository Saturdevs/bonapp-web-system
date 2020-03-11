import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../shared/services/socket-io.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from '../shared/services/notification.service';
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

  constructor(private _socketService: SocketIoService,
    private toast: ToastService,
    private swPush: SwPush,
    private newsletterService: NotificationService) { }

  ngOnInit() {
    this.getTime();
    //this.subscribeToNotifications(); only with http-server
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
      .then(sub => this.newsletterService.addPushSubscriber(sub).subscribe())
      .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
