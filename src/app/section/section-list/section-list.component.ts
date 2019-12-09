import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SectionNewComponent } from '../section-new/section-new.component';
import { isNullOrUndefined } from 'util';

import {
  TableService,
  SectionService,
  Section,
  OrderService,
  Table,
  TableStatus
} from '../../../shared';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.scss']
})
export class SectionListComponent implements OnInit, AfterViewInit {

  @ViewChild(SectionNewComponent)
  @ViewChild('openNewOrderTemplate') openNewOrderTemplate: TemplateRef<any>;
  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private newSection: SectionNewComponent;
  private sections: Array<Section>;
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

  constructor(private _sectionService: SectionService,
    private _tableService: TableService,
    private _orderService: OrderService,
    private _route: ActivatedRoute,
    private modalService: BsModalService,
    private _router: Router) { }

  ngOnInit() {
    this.tableNumber = null;
    this._route.data.subscribe(
      data => {
        this.sections = data['sections'];
      });

    if (this.isSettingsActive()) {
      this.title = "Configuración de secciones y mesas";
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
    return this._router.isActive('/settings/section', true);
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
                this.modalRef = this.modalService.show(this.openNewOrderTemplate, Object.assign({}, this.configNewOrderTemplate, { class: 'customNewOrder' }));
              }
              else {
                this._router.navigate(['./orders/orderNew', this.tableNumber]);
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
