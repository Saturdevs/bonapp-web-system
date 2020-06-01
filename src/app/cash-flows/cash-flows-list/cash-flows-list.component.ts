import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  CashFlow,
  CashRegister,
  CashFlowService,
  CashFlowTypes,
  RightsFunctions,
  AuthenticationService,
  Rights,
  User
} from '../../../shared/index';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-cash-flows-list',
  templateUrl: './cash-flows-list.component.html',
  styleUrls: ['./cash-flows-list.component.scss']
})
export class CashFlowsListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  pageTitle: string = "Movimientos de Caja";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle;
  private modalDeleteMessage;
  public modalRef: BsModalRef;
  cashFlows: CashFlow[];
  filteredCashFlows: CashFlow[];
  _listFilter: string;
  idCashFlowsDelete: any;
  cashRegister: CashRegister;
  cashRegisters: CashRegister[];
  cashRegistersSelect: Array<any> = [];
  typesSelect: Array<any> = [];
  typeSelectedValue: string;
  cashSelectedValue: string;
  startDate: Date;
  endDate: Date;
  typesArray: Array<string> = new Array(CashFlowTypes.INGRESO, CashFlowTypes.EGRESO);
  previous: any;
  currentUser: User;
  enableDelete: Boolean;
  enableDetail: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective

  constructor(private cashFlowService: CashFlowService,
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

    this.route.data.subscribe(
      data => {
        this.cashFlows = data['cashFlows'];
        this.cashRegisters = data['cashRegisters'];
      }
    )

    this.typesSelect.push({ value: 'default', label: 'Todos', selected: true })
    for (let type of this.typesArray) {
      this.typesSelect.push({ value: type, label: type })
    };
    this.typeSelectedValue = 'default';

    this.cashRegistersSelect.push({ value: 'default', label: 'Todas', selected: true })
    for (let cashRegister of this.cashRegisters) {
      this.cashRegistersSelect.push({ value: cashRegister._id, label: cashRegister.name })
    };
    this.cashSelectedValue = 'default';

    this.filteredCashFlows = this.cashFlows;


    this.mdbTable.setDataSource(this.filteredCashFlows);
    this.filteredCashFlows = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_CASH_FLOW);
    this.enableDetail = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DETAIL_CASH_FLOW);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_CASH_FLOW);

    this.enableActionButtons = this.enableDelete || this.enableDetail;
  }

  getCashFlows(): void {
    this.cashFlowService.getAll()
      .subscribe(cashFlows => {
        this.cashFlows = cashFlows;

        this.filteredCashFlows = this.cashFlows;

        this.mdbTable.setDataSource(this.filteredCashFlows);
        this.filteredCashFlows = this.mdbTable.getDataSource();
        this.previous = this.mdbTable.getDataSource();
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        })
  }

  showModalDelete(template: TemplateRef<any>, idCashFlow: any) {
    this.idCashFlowsDelete = idCashFlow;
    this.modalDeleteTitle = "Eliminar Movimiento";
    this.modalDeleteMessage = "¿Seguro desea eliminar este Movimiento?";
    this.modalRef = this.modalService.show(template, { backdrop: true });
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

  deleteCashFlow() {
    if (this.closeModal()) {
      this.cashFlowService.logicalDeleteCashFlow(this.idCashFlowsDelete).subscribe(success => {
        this.getCashFlows();
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        });
    }
  }

  onValueChangedStartDate(value) {
    this.startDate = value;
  }

  onValueChangedEndDate(value) {
    this.endDate = value;
  }

  reloadItems(event) {
    this.getCashFlows();
  }
}
