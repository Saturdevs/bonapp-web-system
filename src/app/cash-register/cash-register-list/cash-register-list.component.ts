import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import { CONFLICT } from 'http-status-codes';

import {
  CashRegister,
  CashRegisterService,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared/index';

import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-cash-register-list',
  templateUrl: './cash-register-list.component.html',
  styleUrls: ['./cash-register-list.component.scss']
})
export class CashRegisterListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  pageTitle: string = "Cajas";
  private serviceErrorTitle = 'Error de Servicio';
  private cantDeleteDefaultLabel = 'La caja por defecto no puede ser eliminada.'
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string;
  private modalDeleteMessage: string;
  private validationMessage: string;
  public modalRef: BsModalRef;
  cashRegisters: CashRegister[];
  filteredCashRegisters: CashRegister[];
  _listFilter: string;
  idCashRegisterDelete: String;
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredCashRegisters = this.listFilter ? this.performFilter(this.listFilter) : this.cashRegisters;
  }

  constructor(private _cashRegisterService: CashRegisterService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.currentUser.subscribe(
      x => {
        this.currentUser = x;
        this.enableActions();
      }
    );

    this.route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters'];
      }
    )

    this.filteredCashRegisters = this.cashRegisters;
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_CASH_REGISTER);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_CASH_REGISTER);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_CASH_REGISTER);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }
  
  performFilter(filterBy: string): CashRegister[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.cashRegisters.filter((cashRegister: CashRegister) =>
      cashRegister.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getCashRegisters(): void {
    this._cashRegisterService.getAll()
      .subscribe(cashRegisters => {
        this.cashRegisters = cashRegisters;
        this.filteredCashRegisters = this.cashRegisters;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message)
        });
  }

  showModalDelete(template: TemplateRef<any>, idCashRegister: String) {
    this.idCashRegisterDelete = idCashRegister;
    this.modalDeleteTitle = "Eliminar Caja Registradora";
    this.modalDeleteMessage = "¿Seguro desea eliminar esta Caja Registradora?";
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

  deleteCashRegister() {
    if (this.closeModal()) {
      this._cashRegisterService.deleteCashRegister(this.idCashRegisterDelete).subscribe(success => {
        this.reloadItems();
      },
        error => {
          if (error.status === CONFLICT) {
            this.validationMessage = error.error.message;
          }
          else {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        });
    }
  }

  reloadItems() {
    this.validationMessage = "";
    this.getCashRegisters();
  }

}
