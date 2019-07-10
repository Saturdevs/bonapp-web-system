import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { SupplierService } from '../../../shared/services/supplier.service';
import { Supplier } from '../../../shared/models/supplier';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  pageTitle: string = "Proveedores";
  private serviceErrorTitle = 'Error de Servicio';
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalDeleteTitle: string = "Eliminar Proveedor";
  private modalDeleteMessage: string = "¿Seguro desea eliminar este Proveedor?";
  public modalRef: BsModalRef;
  suppliers: Supplier[];
  filteredSuppliers: Supplier[];
  idSupplierDelete: any;
  checkboxText: string = "Mostrar proveedores inactivos";
  showInactiveSuppliers: Boolean = false;

  constructor(private _supplierService: SupplierService,
              private route: ActivatedRoute,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.suppliers = data['suppliers'];
        this.filteredSuppliers = this.suppliers;
      }
    )
  }

  getSuppliers(): void {
    this._supplierService.getAll()
      .subscribe(suppliers => {
        this.suppliers = suppliers;
        this.filteredSuppliers = this.suppliers;
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    );
  }

  showModalDelete(template: TemplateRef<any>, idSupplier: any){
    this.idSupplierDelete = idSupplier;
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  deleteSupplier(){
    if (this.closeModal()){
      this._supplierService.deleteSupplier(this.idSupplierDelete).subscribe( 
        success=> {
          this.getSuppliers();
        },
        error => {
          this.showModalError(this.serviceErrorTitle, error.error.message);
        }
      );
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  reloadItems(event) {
    this.getSuppliers();
  }

}
