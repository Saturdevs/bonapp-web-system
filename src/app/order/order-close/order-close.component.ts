import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Order } from '../../../shared';

@Component({
  selector: 'app-order-close',
  templateUrl: './order-close.component.html',
  styleUrls: ['./order-close.component.scss']
})
export class OrderCloseComponent implements OnInit {

  @Input() order: Order;
  @Output() close = new EventEmitter<string>();

  constructor() { }

  private title: String = "CERRAR MESA ";
  private aditionsTitle: String = "ADICIONES";
  private paymentsTitle: String = "PAGOS";
  private closeTableButton: String = "Cerrar Mesa";
  private cancelButton: String = "Cancelar";

  ngOnInit() {
  }

  closeForm() {
    this.close.emit('');    
  }

}
