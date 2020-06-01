import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { MdbTableDirective, MdbTablePaginationComponent, localDataFactory } from 'ng-uikit-pro-standard';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import {
  OrderService,
  Order,
  CashRegister,
  CashRegisterService,
  PaymentType,
  Table,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  /**Labels and strings */
  public pageTitle: string = "Ventas";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  public modalRef: BsModalRef;
  orders: Order[];
  filteredOrders: Order[];
  price: Number;
  previous: any = [];
  colorTheme = 'theme-red';
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  idOrderDelete: any;
  statusSelect: Array<any> = [];
  bsConfig: Partial<BsDatepickerConfig>;
  cashRegistersSelect: Array<any> = [];
  cashRegisters: Array<CashRegister>;
  statusArray: Array<string> = new Array('Open', 'Closed', 'Delivered', 'Not Received', 'Deleted');
  paymentTypes: Array<PaymentType>;
  paymentsSelect: Array<any> = [];
  tableSelect: Array<any> = [];
  tables: Array<Table>;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableActionButtons: Boolean;  

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective


  constructor(private orderService: OrderService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private cdRef: ChangeDetectorRef,
    private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.price = 0;
    this.orders = this.route.snapshot.data['orders'];
    this.cashRegisters = this.route.snapshot.data['cashRegisters'];
    this.paymentTypes = this.route.snapshot.data['paymentTypes'];
    this.tables = this.route.snapshot.data['tables'];

    this.filteredOrders = this.orders;

    this.mdbTable.setDataSource(this.filteredOrders);
    this.filteredOrders = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();

    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });

    this.statusSelect.push({ value: 'default', label: 'Todos', selected: true })
    for (let type of this.statusArray) {
      this.statusSelect.push({ value: type, label: type })
    };

    this.cashRegistersSelect.push({ value: 'default', label: 'Todos', selected: true })
    for (let cashRegister of this.cashRegisters) {
      this.cashRegistersSelect.push({ value: cashRegister._id, label: cashRegister.name })
    };

    this.paymentsSelect.push({ value: 'default', label: 'Todos', selected: true })
    for (let payment of this.paymentTypes) {
      this.paymentsSelect.push({ value: payment._id, label: payment.name })
    };

    this.tableSelect.push({ value: 'default', label: 'Todas', selected: true })
    for (let table of this.tables) {
      this.tableSelect.push({ value: table.number, label: table.number })
    };
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(7);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_ORDER);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DETAIL_ORDER);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  getOrders() {
    this.orderService.getAll().subscribe(
      orders => {
        this.orders = orders;
        this.filteredOrders = this.orders;
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

  showModalDelete(template: TemplateRef<any>, idOrder: any) {
    this.orderService.getOrder(idOrder)
      .subscribe(
        order => {
          if (order.status == 'Open') {
            this.showModalError('Error', 'No puede eliminar un pedido abierto.');
          }
          else {
            this.idOrderDelete = idOrder;
            this.modalDeleteTitle = "Eliminar Pedido";
            this.modalDeleteMessage = "¿Seguro desea eliminar este Pedido?";
            this.modalRef = this.modalService.show(template, { backdrop: true });
          }
        }
      )

  }

  deleteOrder() {
    if (this.closeModal()) {
      this.orderService.getOrder(this.idOrderDelete).subscribe(
        order => {
          order.status = 'Deleted';
          this.orderService.updateOrder(order).subscribe(
            () => {
              this.getOrders();
            },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          );
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
    }
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  reloadItems(event) {
    this.getOrders();
  }

}
