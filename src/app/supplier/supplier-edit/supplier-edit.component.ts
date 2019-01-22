import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Supplier } from '../../../shared/models/supplier';
import { SupplierService } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.scss']
})
export class SupplierEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  errorMessage: string;  
  supplier: Supplier;
  pageTitle: String = 'Editando proveedor: ';
  supplierNameModified: String;

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
        this.errorMessage = <any>error;
        this.showModalError(this.errorTemplate)
      }
    );
  }

  onBack(): void {
    this._router.navigate(['/suppliers-module/suppliers', { outlets: { edit: ['selectItem'] } }]);
  }
  
  showModalError(errorTemplate: TemplateRef<any>){
      this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  showModalCancel(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {backdrop: false});
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
