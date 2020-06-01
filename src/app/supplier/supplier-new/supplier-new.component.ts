import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Supplier,
  SupplierService
} from '../../../shared';

@Component({
  selector: 'app-supplier-new',
  templateUrl: './supplier-new.component.html',
  styleUrls: ['./supplier-new.component.scss']
})
export class SupplierNewComponent implements OnInit {

  @ViewChild('errorTemplate', {static: false}) errorTemplate: TemplateRef<any>;
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: string;
  private modalCancelMessage: String;
  pageTitle: String = 'Nuevo Proveedor';
  private cancelButton: String = 'Cancelar';
  private saveButton: String = 'Aceptar';
  newSupplier: Supplier;
  checkboxText = 'Activo';

  constructor(private _supplierService: SupplierService,
    private _router: Router,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.newSupplier = new Supplier();
    this.newSupplier.active = true;
  }

  saveSupplier() {
    this._supplierService.saveSupplier(this.newSupplier).subscribe(
      supplier => {
        this.onBack()
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) {
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  showModalCancel(template: TemplateRef<any>, idCashRegister: any) {
    this.modalRef = this.modalService.show(template, { backdrop: true });
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack(): void {
    this._router.navigate(['/suppliers-module/suppliers', { outlets: { edit: ['selectItem'] } }]);
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
  }

  cancel() {
    this.onBack();
    this.closeModal();
  }

}
