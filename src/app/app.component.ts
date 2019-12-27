import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../shared/services/socket-io.service';
import { ToastService } from 'ng-uikit-pro-standard';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Web Bar';
  subtitle: string = 'by Los Pibes';
  myDate: Date;

  constructor(private _socketService: SocketIoService,
    private toast: ToastService) { }

  ngOnInit() {
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

}
