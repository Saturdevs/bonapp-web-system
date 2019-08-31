import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { SupplierService } from '../../../shared/services/supplier.service';
import { Supplier } from '../../../shared/models/supplier';
import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit, AfterViewInit {

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
  previous: any;

  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective

  constructor(private _supplierService: SupplierService,
              private route: ActivatedRoute,
              private modalService: BsModalService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.suppliers = data['suppliers'];
        this.filteredSuppliers = this.suppliers;
      }
    )

    this.mdbTable.setDataSource(this.filteredSuppliers);
    this.filteredSuppliers = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
  }


  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(12);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
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
