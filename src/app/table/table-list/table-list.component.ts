import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgGrid, NgGridItem, NgGridConfig, NgGridItemConfig, NgGridItemEvent } from 'angular2-grid';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
	Table,
	TableService,
	Order,
	OrderService,
	UsersInOrder,
	ProductsInUserOrder
} from '../../../shared/index';
import { ToastService } from 'ng-mdb-pro/pro/alerts';
import { isNullOrUndefined } from 'util';

interface Box {
    id: number;
	config: any;
	status: any;
}

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit{
	public modalRef: BsModalRef;
  	private boxes: Array<Box> = [];
	private rgb: string = '#efefef';
	private curNum;
	private gridConfig: NgGridConfig = <NgGridConfig>{
		'margins': [1],
		'draggable': false,
		'resizable': false,
		'max_cols': 100,
		'max_rows': 200,
		'visible_cols': 0,
		'visible_rows': 20,
		'min_cols': 1,
		'min_rows': 1,
		'col_width': 1,
		'row_height': 1,
		'cascade': '',
		'min_width': 1,
		'min_height': 1,
		'fix_to_grid': true,
		'auto_style': true,
		'auto_resize': true,
		'maintain_ratio': false,
		'prefer_new': false,
		'zoom_on_drag': false,
		'limit_to_screen': true
	};
	private itemPositions: Array<any> = [];
	tablesNow: Array<Table> = [];
	tablesTotal: Array<Table> = [];
	private errorMessage: string;
	deletedTables: Array<any> = [];
	addedTables: Array<Table> = [];
	settingsActive: Boolean;
	ordersActive: Boolean;
	green: Boolean;
	red: Boolean;
	blue: Boolean;
	yellow: Boolean;
	selectedTable: Table;
	tableNumberDelete: number;
	qtyProd: number;

	constructor(private _router: Router,
							private _tableService: TableService,
							private _orderService: OrderService,
							private _route: ActivatedRoute,
							private modalService: BsModalService,
							private toast: ToastService) 
				{}
	
	ngOnInit() {		
		//this.tablesNow = this._route.snapshot.data['tables'];
		this._route.data.subscribe(
			data => { 
				this.addedTables = [];
				this.tablesNow = data['tables'];
				this.tablesTotal = data['totalTables'];
				this._setDashConfig(); 
			}
		);	
		console.log(this.tablesTotal);
		console.log(this.tablesNow);
			
		if(this.isSettingsActive()) {
			this.settingsActive = true;
			this.gridConfig.draggable = true;
			this.gridConfig.resizable = true;
		}
		
		if(this.isOrdersActive()) {
			this.ordersActive = true;
			this.gridConfig.draggable = false;
			this.gridConfig.resizable = false;
			this.selectedTable = new Table();
		}
	}

	saveChanges(){
		let i;
		let lastIdTablesNow = 0;
		let indexAdded = 0;
		//Recorro el array de las mesas existentes y actualizo
		for (i = 0; i < this.tablesNow.length; i++) {
			if(this.tablesNow[i]){
				if(this.tablesNow[i].number === this.boxes[i].id){
					this.tablesNow[i].col = this.boxes[i].config.col;
					this.tablesNow[i].row = this.boxes[i].config.row;
					this.tablesNow[i].sizex = this.boxes[i].config.sizex;
					this.tablesNow[i].sizey = this.boxes[i].config.sizey;
					this._tableService.updateTable(this.tablesNow[i]).subscribe( 
						() => console.log("hizo el update"+this.tablesNow[i].number)
					)
				}
			}
			lastIdTablesNow = i + 1;
		}
		//Recorro el array de las mesas creadas y las agrego.
		for (i = lastIdTablesNow; i < this.boxes.length; i++) {
			if(this.addedTables[indexAdded]){
				if(this.addedTables[indexAdded].number === this.boxes[i].id){
				this.addedTables[indexAdded].col = this.boxes[i].config.col;
				this.addedTables[indexAdded].row = this.boxes[i].config.row;
				this.addedTables[indexAdded].sizex = this.boxes[i].config.sizex;
				this.addedTables[indexAdded].sizey = this.boxes[i].config.sizey;
				console.log(this.addedTables[indexAdded])
				this._tableService.saveTable(this.addedTables[indexAdded]).subscribe(
				() => {
					this.addedTables = [];
					console.log("Agrego las mesas	")
				}
				)
				}	
			}
			indexAdded = indexAdded + 1;
		}
		//Recorro el array de las mesas eliminadas y actualizo.
		for (i = 0; i < this.deletedTables.length; i++) {
			this._tableService.deleteTable(this.deletedTables[i].id).subscribe(resp => {
				this.deletedTables = [];
				console.log("Elimino"+ this.deletedTables[i].id)
			})
		}
		this.showSuccessToast()
	}

	addBox(): void {
		const conf: NgGridItemConfig = this._generateDefaultItemConfig();
		conf.payload = this.curNum++;
		this.boxes.push({ id: conf.payload, config: conf, status: 'Libre' });
		this.addedTables.push({number: this.boxes[this.boxes.length-1].id,
							 section: this._route.snapshot.params['id'],
							 status: this.boxes[this.boxes.length-1].status,
							 col: this.boxes[this.boxes.length-1].config.col,
							 row: this.boxes[this.boxes.length-1].config.row,
							 sizex: this.boxes[this.boxes.length-1].config.sizex,
							 sizey: this.boxes[this.boxes.length-1].config.sizey});
		console.log(this.boxes[this.boxes.length-1])
	}

	removeWidget(index: number): void {
		if (this.boxes[index]) {
			this.boxes.splice(index, 1);
		}
		if(this.tablesNow[index]){
			this.tablesNow.splice(index, 1);
			this.deletedTables.push({'id': index})
		}
	}

	updateItem(index: number, event: NgGridItemEvent): void {
	}

	onDrag(index: number, event: NgGridItemEvent): void {
	}

	onResize(index: number, event: NgGridItemEvent): void {
	}

	private _generateDefaultItemConfig(): NgGridItemConfig {
		return {'col': 1, 'row': 1, 'sizex': 5, 'sizey': 20 };
	}

	private _setDashConfig() {	
		let i;
		let dashconf = [];
		this.boxes = [];
		//Obtenemos las mesas y asignamos al array boxes que se utiliza para mostrar las mesas en el ngFor.			
		console.log("dashconfig")
		console.log(this.tablesNow);
		for (i = 0; i < this.tablesNow.length; i++) {	
			console.log(i)		
			dashconf.push({ 'col': this.tablesNow[i].col, 'row': this.tablesNow[i].row, 'sizex': this.tablesNow[i].sizex, 'sizey': this.tablesNow[i].sizey});
			const conf = dashconf[i];
			conf.payload = 1 + i;
			this.boxes[i] = { id: this.tablesNow[i].number, config: conf, status: this.tablesNow[i].status};
		}

		if (isNullOrUndefined(this.tablesTotal) || this.tablesTotal.length === 0) {
			this.curNum = 1;
		} 
		else {
			this.curNum = this.tablesTotal[this.tablesTotal.length - 1].number + 1;				
		}		
	}
	
	isSettingsActive() {
		return this._router.isActive('/settings/section/tables/' + this._route.snapshot.params['id'], true);
	}

	isOrdersActive() {
		return this._router.isActive('/orders/section/tables/' + this._route.snapshot.params['id'], true);
	}

	showSuccessToast() { 
		let options = { timeOut: 2500 };
		this.toast.success('Se ha guardado correctamente','AppBares Dice:', options);
	}

	showDeleteModal(deleteTemplate: TemplateRef<any>, tableNumber: number){
		if (this.settingsActive === true) {
			this.tableNumberDelete = tableNumber;
			this.modalRef = this.modalService.show(deleteTemplate, {backdrop: true});
		}	
	}

	showOpenOrderModal(openNewOrderTemplate: TemplateRef<any>, tableNumber: any){
		if (this.ordersActive === true) {
			this._tableService.getTableByNumber(tableNumber).subscribe(
				table => {
					this.selectedTable = table;

					this._orderService.getOrderOpenByTable(this.selectedTable.number).subscribe(
						order => {
							//Verifico que el pedido para la mesa no sea nulo o undefined por si se creo el pedido
							//pero no se actualizó el estado de la mesa y verifico que el estado de la mesa sea Libre
							//porque desde la app cuando se lee el código qr la mesa pasa a Ocupada pero no se crea el pedido					
							if (isNullOrUndefined(order) && this.selectedTable.status === "Libre") {
								this.modalRef = this.modalService.show(openNewOrderTemplate, {backdrop: true});
							}
							else {
								this._router.navigate(['./orders/orderNew', tableNumber]);
							}
						},
						error => { this.errorMessage = <any>error }
					)
				},
				error => { this.errorMessage = <any>error }
			)			
		}		
	}
	
	newOrder(){
		let order = new Order();
		this.closeModal();
		this.selectedTable.status = "Ocupada";
		this._orderService.getLastOrder().subscribe(
			lastOrder => {
				console.log("subscribe")
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
				order.users = new UsersInOrder();
				//aca hay que setear el id del usuario admin. todavia no esta creado.
				order.users.id = "5b39625a42d7744c995253c5";
				order.users.owner = true;
				order.users.products = new Array<ProductsInUserOrder>();
				order.users.products = [];		
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

	deleteTable(){
    if (this.closeModal()){
      this._tableService.deleteTableByNumber(this.tableNumberDelete).subscribe( success=> {
				console.log("delete")
        this.getTables();
      });
    }
	}
	
	getTables() {
		console.log("gettables")
		this._tableService.getAll().subscribe(
			allTables => {
				console.log("alltables")
				this.tablesTotal = allTables;
				this._tableService.getTablesBySection(this._route.snapshot.params['id']).subscribe(
					sectionTables => {
						console.log("sectiontables")
						this.tablesNow = sectionTables;
						this._setDashConfig();
					}
				)
			},
			error => this.errorMessage = <any>error
		)
	}

	closeModal(){
        this.modalRef.hide();
        this.modalRef = null;
        return true;        
	}


}
