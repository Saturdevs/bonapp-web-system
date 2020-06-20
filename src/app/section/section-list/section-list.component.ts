import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { isNullOrUndefined } from 'util';

import {
  TableService,
  SectionService,
  Section,
  OrderService,
  Table,
  TableStatus,
  RightsFunctions,
  Rights,
  AuthenticationService,
  User,
  ParamService,
  OrderTypes,
  Params
} from '../../../shared';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent implements OnInit, AfterViewInit {

  @ViewChild('askPinTemplate') askPinTemplate: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle: string;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private rightErrorTitle: string;
  private rightErrorMessage: string;
  sections: Array<Section>;
  public modalRef: BsModalRef;
  settingsActive: Boolean;
  ordersActive: Boolean;
  title: string;
  tableNumber: number;
  selectedTable: Table;
  statusLibre = TableStatus.LIBRE;
  statusOcupada = TableStatus.OCUPADA;
  statusReservada = TableStatus.RESERVADA;
  configNewOrderTemplate = {
    backdrop: true,
  }
  currentUser: User;

  constructor(private _sectionService: SectionService,
    private _authenticationService: AuthenticationService,
    private _transalateService: TranslateService,
    private _tableService: TableService,
    private _orderService: OrderService,
    private _paramService: ParamService,
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private _router: Router) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
      }
    );

    this._transalateService.stream(['Commons.serviceErrorTitle', 'Commons.rightErrorTitle', 'Commons.rightErrorMessage']).subscribe((translations) => {
      this.serviceErrorTitle = translations['Commons.serviceErrorTitle'];
      this.rightErrorTitle = translations['Commons.rightErrorTitle'];
      this.rightErrorMessage = translations['Commons.rightErrorMessage'];
    })

    this.tableNumber = null;
    this._route.data.subscribe(
      data => {
        this.sections = data['sections'];
      });

    if (this.isSettingsActive()) {
      this.title = "Configuración de salas y mesas";
      this.settingsActive = true;
    }

    if (this.isOrdersActive()) {
      this.title = "Nuevo Pedido"
      this.ordersActive = true;
      this.selectedTable = new Table();
    }
  }

  ngAfterViewInit(): void {
    if (!isNullOrUndefined(document.getElementById("tab0").click())) {
      document.getElementById("tab0").click();
    }
  }

  isSettingsActive() {
    return this._router.isActive('/settings/tables-section', true);
  }

  isOrdersActive() {
    return this._router.isActive('/orders/section', true);
  }

  reloadSections(closed: Boolean) {
    if (closed === true) {
      this._sectionService.getAll()
        .subscribe(
          data => {
            this.sections = data;
          });
    }
  }

  onKeyDownEnter(event) {
    if (!isNullOrUndefined(this.tableNumber)) {
      this._tableService.getTableByNumber(this.tableNumber).subscribe(
        table => {
          this.selectedTable = table;

          this._orderService.getOrderOpenByTable(table.number).subscribe(
            order => {
              if (isNullOrUndefined(order) && table.status === this.statusLibre) {
                if (RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_ORDER)) {
                  if (this.currentUser.isGeneral) {
                    if (this._paramService.getBooleanParameter(Params.ASK_FOR_USER_PIN)) {
                      this.modalRef = this.modalService.show(this.askPinTemplate, Object.assign({}, this.configNewOrderTemplate, { class: 'customNewOrder' }));
                    } else {
                      this.openNewOrder(this.tableNumber);
                    }
                  } else {
                    this.openNewOrder(this.tableNumber);
                  }
                } else {
                  this.showModalError(this.rightErrorTitle, this.rightErrorMessage);
                }
              }
              else {
                if (this.currentUser.isGeneral) {
                  if (this._paramService.getBooleanParameter(Params.ASK_FOR_USER_PIN)) {
                    this.modalRef = this.modalService.show(this.askPinTemplate, Object.assign({}, this.configNewOrderTemplate, { class: 'customNewOrder' }));
                  } else {
                    this.openExistingOrder(this.tableNumber);
                  }
                } else {
                  this.openExistingOrder(this.tableNumber);
                }
              }
            },
            error => {
              this.showModalError(this.serviceErrorTitle, error.error.message);
            }
          )
        },
        error => {
          this.tableNumber = null;
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      )
    }
  }

  openNewOrder(tableNumber: number) {
    const order = this._orderService.createOrder(tableNumber, OrderTypes.RESTAURANT);
    this._orderService.saveOrder(order).subscribe(
      () => {
        this.openExistingOrder(tableNumber);
      }
    )
  }

  openExistingOrder(tableNumber: number) {
    this._orderService.setEmployeeWhoAddedId(this.currentUser._id);
    this._router.navigate(['./orders/orderNew', tableNumber]);
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  closeModal() {
    this.tableNumber = null;
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }
}
