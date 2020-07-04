import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CONFLICT } from 'http-status-codes';

import {
  PaymentTypeService,
  PaymentType,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

@Component({
  selector: 'app-payment-type-list',
  templateUrl: './payment-type-list.component.html',
  styleUrls: ['./payment-type-list.component.scss']
})
export class PaymentTypeListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
  pageTitle: string = "Formas de Pago";
  cantDeleteDefaultPaymentTypeLabel = 'El tipo de pago por defecto y el tipo de pago Efectivo no puede ser eliminados.';
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string = "Eliminar Forma de Pago";
  private modalDeleteMessage: string = "¿Estas seguro que desea eliminar la Forma de Pago?";
  validationMessage: string;
  public modalRef: BsModalRef;
  paymentTypes: PaymentType[];
  filteredPaymentTypes: PaymentType[];
  _listFilter: string;
  idPaymentTypeDelete: any; currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredPaymentTypes = this.listFilter ? this.performFilter(this.listFilter) : this.paymentTypes;
  }

  constructor(private paymentTypeService: PaymentTypeService,
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
        this.paymentTypes = data['paymentTypes'];
      }
    )

    this.filteredPaymentTypes = this.paymentTypes;
  }

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_PAYMENT_TYPE);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_PAYMENT_TYPE);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_PAYMENT_TYPE);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
  }

  performFilter(filterBy: string): PaymentType[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.paymentTypes.filter((paymentType: PaymentType) =>
      paymentType.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  getPaymentTypes(): void {
    this.paymentTypeService.getAll()
      .subscribe(paymentTypes => {
        this.paymentTypes = paymentTypes;
        this.filteredPaymentTypes = this.paymentTypes;
      },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      )
  }

  showModalDelete(template: TemplateRef<any>, idPaymentType: any) {
    this.idPaymentTypeDelete = idPaymentType;
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  deletePaymentType() {
    if (this.closeModal()) {
      this.paymentTypeService.deletePaymentType(this.idPaymentTypeDelete).subscribe(
        success => {
          this.getPaymentTypes();
        },
        error => {
          if (error.status === CONFLICT) {
            this.validationMessage = error.error.message;
          }
          else {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        }
      );
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  reloadItems(event) {
    this.getPaymentTypes();
  }

}
