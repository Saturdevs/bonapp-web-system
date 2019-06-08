import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Supplier } from '../../../shared/models/supplier';
import { SupplierService } from '../../../shared/services/supplier.service';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';

@Component({
  selector: 'app-supplier-new',
  templateUrl: './supplier-new.component.html',
  styleUrls: ['./supplier-new.component.scss']
})
export class SupplierNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  pageTitle: String = 'Nuevo Proveedor';
  newSupplier: Supplier;

  constructor(private _supplierService: SupplierService,
              private _route: ActivatedRoute,
              private _router: Router,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newSupplier = new Supplier();
    this.newSupplier.active = true;
  }

  saveSupplier(){
    this._supplierService.saveSupplier(this.newSupplier).subscribe(
      supplier =>
      { 
        this.onBack()
      },
      error => 
      {         
        this.showModalError(this.serviceErrorTitle, <any>error);
      }
    );
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
  }

  onBack(): void {
    this._router.navigate(['/suppliers-module/suppliers', { outlets: { edit: ['selectItem'] } }]);
  }

}
