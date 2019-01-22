import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Supplier } from '../../../shared/models/supplier';
import { SupplierService } from '../../../shared/services/supplier.service';

@Component({
  selector: 'app-supplier-new',
  templateUrl: './supplier-new.component.html',
  styleUrls: ['./supplier-new.component.scss']
})
export class SupplierNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  errorMessage: string;
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
        this.errorMessage = <any>error,
        this.showModalError(this.errorTemplate)
      }
    );
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalError(errorTemplate: TemplateRef<any>){
    this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  onBack(): void {
    this._router.navigate(['/suppliers-module/suppliers', { outlets: { edit: ['selectItem'] } }]);
  }

}
