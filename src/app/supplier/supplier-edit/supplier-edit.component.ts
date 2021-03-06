import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Supplier,
  SupplierService
} from '../../../shared';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.scss']
})
export class SupplierEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  supplier: Supplier;
  pageTitle: String = 'Editando proveedor: ';
  cancelButton: String = 'Cancelar';
  saveButton: String = 'Aceptar';
  supplierNameModified: String;
  checkboxText = 'Activo';

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService,
              private _supplierService: SupplierService) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.supplier = data['supplier'];
        this.supplierNameModified = this.supplier.name;
      }
    )
  }

  updateSupplier(supplier: Supplier) {
    this._supplierService.updateSupplier(supplier).subscribe(
      supplier => { 
        this.supplier = supplier,
        this.onBack()
      },
      error => {         
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  onBack(): void {
    this._router.navigate(['/suppliers-module/suppliers', { outlets: { edit: ['selectItem'] } }]);
  }
  
  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {backdrop: false});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "??Est?? seguro que desea cancelar los cambios?";
  }

  cancel(){
    this.onBack();
    this.closeModal();
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

}
