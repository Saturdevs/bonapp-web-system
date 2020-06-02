import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

 import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 
import {
  Supplier,
  SupplierService,
  AuthenticationService,
  User,
  Rights,
  RightsFunctions
} from '../../../shared';

import { MdbTableDirective, MdbTablePaginationComponent } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements OnInit, AfterViewInit {

  @ViewChild('errorTemplate') errorTemplate: TemplateRef<any>;
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
  currentUser: User;
  enableDelete: Boolean;
  enableEdit: Boolean;
  enableNew: Boolean;
  enableActionButtons: Boolean;

  @ViewChild(MdbTablePaginationComponent, {static: true}) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective,{static: true}) mdbTable: MdbTableDirective

  constructor(private _supplierService: SupplierService,
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

  /**
   * Habilita/Deshabilita las opciones de editar, nuevo y eliminar según los permisos que tiene
   * el usuario.
   */
  enableActions(): void {
    this.enableDelete = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.DELETE_SUPPLIER);
    this.enableEdit = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.EDIT_SUPPLIER);
    this.enableNew = RightsFunctions.isRightActiveForUser(this.currentUser, Rights.NEW_SUPPLIER);

    this.enableActionButtons = this.enableDelete || this.enableEdit;
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

  showModalDelete(template: TemplateRef<any>, idSupplier: any) {
    this.idSupplierDelete = idSupplier;
    this.modalRef = this.modalService.show(template, { backdrop: true });
  }

  closeModal() {
    this.modalRef.hide();
    this.modalRef = null;
    return true;
  }

  deleteSupplier() {
    if (this.closeModal()) {
      this._supplierService.deleteSupplier(this.idSupplierDelete).subscribe(
        success => {
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
    this.modalRef = this.modalService.show(this.errorTemplate, { backdrop: true });
  }

  reloadItems(event) {
    this.getSuppliers();
  }

}
