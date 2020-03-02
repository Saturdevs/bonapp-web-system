import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgGridConfig, NgGridItemConfig, NgGridItemEvent } from 'angular2-grid';
import { CONFLICT } from 'http-status-codes';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
	Table,
	TableService,
	OrderService,
	TableStatus,
	AuthenticationService,
	User,
	Rights,
	RightsFunctions
} from '../../../shared/index';
import { ToastService } from 'ng-uikit-pro-standard';
import { isNullOrUndefined } from 'util';

interface Box {
	_id: string
	id: number;
	config: any;
	status: any;
}

@Component({
	selector: 'app-table-list',
	templateUrl: './table-list.component.html',
	styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {

	@ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
	@ViewChild('cancelTemplate') cancelTemplate: TemplateRef<any>;
	private serviceErrorTitle = 'Error de Servicio';
	private rightErrorTitle = 'Error de Permisos';
	private rightErrorMessage = 'Usted no posee los permisos requeridos para realizar la acción deseada. Pongase en contacto con el administrador del sistema.';
	private modalErrorTittle: string;
	private modalErrorMessage: string;
	private modalDeleteMessage = "¿Estas seguro que desea eliminar esta mesa?";
	private modalDeleteTitle = "Eliminar Mesa";
	private modalCancelTitle: string;
	private modalCancelMessage: string;
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
	@ViewChild('openNewOrderTemplate') openNewOrderTemplate;

	private itemPositions: Array<any> = [];
	tablesNow: Array<Table> = [];
	tablesTotal: Array<Table> = [];
	settingsActive: Boolean;
	ordersActive: Boolean;
	green: Boolean;
	red: Boolean;
	blue: Boolean;
	yellow: Boolean;
	selectedTable: Table;
	boxToDelete: Box;
	qtyProd: number;
	config = {
		backdrop: true,
	}
	currentUser: User;
	enableDelete: Boolean;
	enableEdit: Boolean;
	enableNew: Boolean;
	enableActionButtons: Boolean;

	constructor(private _router: Router,
		private _tableService: TableService,
		private _orderService: OrderService,
		private _route: ActivatedRoute,
		private modalService: BsModalService,
		private toast: ToastService,
		private _authenticationService: AuthenticationService) { }

	ngOnInit() {
		this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
      }
		);
		
		this._tableService.addedTables = [];
		this._tableService.updatedTables = [];
		this._route.data.subscribe(
			data => {
				this.tablesNow = data['tables'];
				this.tablesTotal = data['totalTables'];
				if (this._tableService.addedTables.length !== 0) {
					this._tableService.addedTables.forEach(table => {
						this.tablesTotal.push(table);
						if (table.section === this._route.snapshot.params['id']) {
							this.tablesNow.push(table);
						}
					})
				}

				if (this._tableService.updatedTables.length !== 0) {
					this._tableService.updatedTables.forEach(table => {
						this.tablesTotal.push(table);
						if (table.section === this._route.snapshot.params['id']) {
							let index = this.tablesNow.findIndex(t => t.number === table.number);
							if (index !== -1) {
								this.tablesNow.splice(index, 1);
							}
							this.tablesNow.push(table);
						}
					})
				}
				this._setDashConfig();
			}
		);

		if (this.isSettingsActive()) {
			this.settingsActive = true;
			this.gridConfig.draggable = true;
			this.gridConfig.resizable = true;
		}

		if (this.isOrdersActive()) {
			this.ordersActive = true;
			this.gridConfig.draggable = false;
			this.gridConfig.resizable = false;
			this.selectedTable = new Table();
		}
	}

	saveChanges() {
		let i;
		let lastIdTablesNow = 0;
		let indexAdded = 0;
		//Recorro el array de las mesas existentes y actualizo
		for (i = 0; i < this.tablesNow.length; i++) {
			if (this.tablesNow[i]) {
				if (this.tablesNow[i].number === this.boxes[i].id) {
					this.tablesNow[i].col = this.boxes[i].config.col;
					this.tablesNow[i].row = this.boxes[i].config.row;
					this.tablesNow[i].sizex = this.boxes[i].config.sizex;
					this.tablesNow[i].sizey = this.boxes[i].config.sizey;
					this._tableService.updateTable(this.tablesNow[i]).subscribe(
						() => console.log("hizo el update" + this.tablesNow[i].number)
					)
				}
			}
			lastIdTablesNow = i + 1;
		}
		//Recorro el array de las mesas creadas y las agrego.
		for (i = lastIdTablesNow; i < this.boxes.length; i++) {
			if (this._tableService.addedTables[indexAdded]) {
				if (this._tableService.addedTables[indexAdded].number === this.boxes[i].id) {
					this._tableService.addedTables[indexAdded].col = this.boxes[i].config.col;
					this._tableService.addedTables[indexAdded].row = this.boxes[i].config.row;
					this._tableService.addedTables[indexAdded].sizex = this.boxes[i].config.sizex;
					this._tableService.addedTables[indexAdded].sizey = this.boxes[i].config.sizey;
					console.log(this._tableService.addedTables[indexAdded])
					this._tableService.saveTable(this._tableService.addedTables[indexAdded]).subscribe(
						() => {
							this._tableService.addedTables = [];
							console.log("Agrego las mesas	")
						}
					)
				}
			}
			indexAdded = indexAdded + 1;
		}

		this.showSuccessToast()
	}

	addBox(): void {
		const conf: NgGridItemConfig = this._generateDefaultItemConfig();
		conf.payload = this.curNum++;
		this.boxes.push({ _id: null, id: conf.payload, config: conf, status: TableStatus.LIBRE });
		this._tableService.addedTables.push(this.createTable(this.boxes[this.boxes.length - 1]));
	}

	createTable(box: Box): Table {
		let table = new Table();

		table._id = box._id;
		table.number = box.id;
		table.section = this._route.snapshot.params['id'];
		table.status = box.status;
		table.col = box.config.col;
		table.row = box.config.row;
		table.sizex = box.config.sizex;
		table.sizey = box.config.sizey;

		return table;
	}

	onChangeStop(box: Box, event: NgGridItemEvent): void {
		let table = this._tableService.addedTables.find(table => table.number === box.id);
		if (isNullOrUndefined(table)) {
			let index = this._tableService.updatedTables.findIndex(table => table.number === box.id);
			box.config.col = event.col;
			box.config.row = event.row;
			box.config.sizex = event.sizex;
			box.config.sizey = event.sizey;
			let table = this.createTable(box);
			if (index === -1) {
				this._tableService.updatedTables.push(table);
			} else {
				this._tableService.updatedTables[index] = table;
			}
		}
		console.log("Index: " + table)
		console.log("onResizeStop: " + box.id)
	}

	private _generateDefaultItemConfig(): NgGridItemConfig {
		return { 'col': 1, 'row': 1, 'sizex': 5, 'sizey': 20 };
	}

	private _setDashConfig() {
		let i;
		let dashconf = [];
		this.boxes = [];
		//Obtenemos las mesas y asignamos al array boxes que se utiliza para mostrar las mesas en el ngFor.
		for (i = 0; i < this.tablesNow.length; i++) {
			dashconf.push({ 'col': this.tablesNow[i].col, 'row': this.tablesNow[i].row, 'sizex': this.tablesNow[i].sizex, 'sizey': this.tablesNow[i].sizey });
			const conf = dashconf[i];
			conf.payload = 1 + i;
			this.boxes[i] = { _id: this.tablesNow[i]._id, id: this.tablesNow[i].number, config: conf, status: this.tablesNow[i].status };
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
		this.toast.success('Se ha guardado correctamente', 'AppBares Dice:', options);
	}

	showDeleteModal(deleteTemplate: TemplateRef<any>, box: Box) {
		if (this.settingsActive === true) {
			this.boxToDelete = box;
			this.modalRef = this.modalService.show(deleteTemplate, { backdrop: true });
		}
	}

	showOpenOrderModal(openNewOrderTemplate: TemplateRef<any>, tableNumber: any) {
		if (this.ordersActive === true) {
			this._tableService.getTableByNumber(tableNumber).subscribe(
				table => {
					this.selectedTable = table;

					this._orderService.getOrderOpenByTable(this.selectedTable.number).subscribe(
						order => {
							//Verifico que el pedido para la mesa no sea nulo o undefined por si se creo el pedido
							//pero no se actualizó el estado de la mesa y verifico que el estado de la mesa sea Libre
							//porque desde la app cuando se lee el código qr la mesa pasa a Ocupada pero no se crea el pedido					
							if (isNullOrUndefined(order) && this.selectedTable.status === TableStatus.LIBRE) {
								if (RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_ORDER)) {
									this.modalRef = this.modalService.show(openNewOrderTemplate, Object.assign({}, this.config, { class: 'customNewOrder' }));
								} else {
									this.showModalError(this.rightErrorTitle, this.rightErrorMessage);
								}								
							}
							else {
								this._router.navigate(['./orders/orderNew', tableNumber]);
							}
						},
						error => {
							this.showModalError(this.serviceErrorTitle, error.error.message);
						}
					)
				},
				error => {
					this.showModalError(this.serviceErrorTitle, error.error.message);
				}
			)
		}
	}

	deleteTable() {
		if (this.closeModal()) {
			if (!isNullOrUndefined(this.boxToDelete._id)) {
				this._tableService.deleteTable(this.boxToDelete._id).subscribe(
					success => {
						this.getTables();
					},
					error => {
						if (error.status === CONFLICT) {
							this.showModalCancel(this.cancelTemplate, error.error.message)
						}
						else {
							this.showModalError(this.serviceErrorTitle, error.error.message);
						}
					}
				);
			} else {
				//Si el id de la box es null quiere decir que recien se agrega al array de boxes y addedTables
				//Todavia no se guardo la nueva mesa en la base de datos, por lo que debe borrarse de los arrays
				//this.boxes y this.addedTables
				let boxIndex = this.boxes.indexOf(this.boxToDelete);
				if (boxIndex !== -1) {
					this.boxes.splice(boxIndex, 1);
				}
				//creo la tabla para poder hacer el indexOf en el array addedTables
				let addedTable = this.createTable(this.boxToDelete);
				let tableIndex = this._tableService.addedTables.indexOf(addedTable);
				if (tableIndex !== -1) {
					this._tableService.addedTables.splice(tableIndex, 1);
				}
			}
		}
	}

	showModalCancel(template: TemplateRef<any>, modalMessage: string) {
		this.modalRef = this.modalService.show(template, { backdrop: true });
		this.modalCancelTitle = "Eliminar Mesa";
		this.modalCancelMessage = modalMessage;
	}

	delete() {
		this._tableService.unSetAndDeleteTable(this.boxToDelete.id).subscribe(
			succes => {
				this.getTables();
				this.closeModal();
			},
			error => {
				this.showModalError(this.serviceErrorTitle, error.error.message);
			}
		)
	}

	getTables() {
		this._tableService.getAll().subscribe(
			allTables => {
				this.tablesTotal = allTables;
				this._tableService.getTablesBySection(this._route.snapshot.params['id']).subscribe(
					sectionTables => {
						this.tablesNow = sectionTables;
						this._setDashConfig();
					}
				)
			},
			error => {
				this.showModalError(this.serviceErrorTitle, error.error.message);
			}
		)
	}

	showModalError(errorTittleReceived: string, errorMessageReceived: string) {
		this.modalErrorTittle = errorTittleReceived;
		this.modalErrorMessage = errorMessageReceived;
		this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
	}

	closeModal() {
		this.modalRef.hide();
		this.modalRef = null;
		return true;
	}
}
