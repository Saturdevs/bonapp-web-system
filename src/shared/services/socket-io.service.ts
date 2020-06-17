import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket;

  constructor(private _route: ActivatedRoute) {
    this.socket = io(environment.socket_url);
    this.socketIOConnection();
  }
  
  /** Conecta el sistema web con el socket. Emite el metodo webSystemConnection para que el socket reconozca que es el sistema web */ 
  socketIOConnection() { //Hay que ver si la llamada es aca o en otro lado de la app.
    let connection = {}; //ver si necesitamos parametros para mandarle al back para cuando se conecta por primera vez
    this.socket.emit('webSystemConnection', connection);
  }

  /** Recibe la llamada al mozo. Devuelve un observable que avisa a sus suscribers cada vez que el socket recibio el metodo callWaiter (es emitido desde la app al backend y del backend al sistema web). */
  waiterCall() { 
    return Observable.create((observer) => {
      this.socket.on('callWaiter', (waiterCall) => {
        observer.next(waiterCall);
      });
    });
  }

    /** Recibe la orden de actualizar las mesas. Devuelve un observable que avisa a sus suscribers cada vez que el socket recibio el metodo updateTable (es emitido desde la app al backend y del backend al sistema web). */
    updateTable() { 
      return Observable.create((observer) => {
        this.socket.on('updateTable', (updateTable) => {
          observer.next(true);
        });
      });
    }

}
