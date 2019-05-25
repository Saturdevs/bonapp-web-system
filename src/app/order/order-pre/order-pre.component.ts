import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

import { 
  Table, 
  Order,
  OrderService,
  UsersInOrder,
  ProductsInUserOrder,
  TableService
} from '../../../shared/index';

@Component({
  selector: 'app-order-pre',
  templateUrl: './order-pre.component.html',
  styleUrls: ['./order-pre.component.scss'],
})
export class OrderPreComponent implements OnInit {
  
  @Input() selectedTable: Table;
  @Output() close = new EventEmitter<string>();
  public modalRef: BsModalRef;
  private errorMessage: string;
  private title: string = 'Nuevo Pedido';
  private tableNumber: string = 'Numero de mesa';
 
  constructor(private _orderService: OrderService,
              private _tableService: TableService,
              private _router: Router) { }

  ngOnInit() {
    console.log(this.selectedTable);
  }

  newOrder(){
		let order = new Order();
		this.closeModal();
		this.selectedTable.status = "Ocupada";
		this._orderService.getLastOrder().subscribe(
			lastOrder => {
				if (isNullOrUndefined(lastOrder))
				{
					order.orderNumber = 1;
				}
				else
				{
					order.orderNumber = lastOrder.orderNumber + 1;
				}

				order.type = "Restaurant";
				order.table = this.selectedTable.number;
				order.status = "Open";
				order.users = new Array<UsersInOrder>();
				order.users[0] = new UsersInOrder();
				//aca hay que setear el id del usuario admin. todavia no esta creado.
				order.users[0].user = "5b39625a42d7744c995253c5";
				order.users[0].owner = true;
				order.users[0].products = new Array<ProductsInUserOrder>();
				order.users[0].products = [];		
				order.app = false;		
				this._orderService.saveOrder(order).subscribe(() => {
					this._tableService.updateTable(this.selectedTable).subscribe(
						table => { 
							this.selectedTable = table;
							this._router.navigate(['./orders/orderNew', this.selectedTable.number]); 
						},
						error => { this.errorMessage = <any>error }
					)
				})
			},
			error => { this.errorMessage = <any>error }
		)			
  }
  
  closeModal(){
    this.close.emit('');
    return true;        
  }
}
