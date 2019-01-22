import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Component({
  selector: 'app-payment-type-new',
  templateUrl: './payment-type-new.component.html',
  styleUrls: ['./payment-type-new.component.scss']
})
export class PaymentTypeNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  paymentType: PaymentType = new PaymentType();
  errorMessage: string;
  paymentTypeForm: FormGroup;
  pageTitle: String = 'Nueva Forma de Pago';

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _paymentTypeService: PaymentTypeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.paymentTypeForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: true   
    });
  } 

  savePaymentType() {
    if (this.paymentTypeForm.dirty && this.paymentTypeForm.valid) {
      let pt = Object.assign({}, this.paymentTypeForm.value);      

      this._paymentTypeService.savePaymentType(pt)
          .subscribe(    
            paymentType => {
              console.log(paymentType)
              this._router.navigate(['/settings/general/paymentTypes', { outlets: { edit: ['selectItem'] } }])
            },        
            (error: any) => { 
              this.errorMessage = <any>error,
              this.showModalError(this.errorTemplate)
            }
          );
    }
  }

  showModalError(errorTemplate: TemplateRef<any>){
    this.modalRef = this.modalService.show(errorTemplate, {backdrop: true});
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalCancel(template: TemplateRef<any>, idSize: any){
    this.modalRef = this.modalService.show(template, {backdrop: true});
  }

  cancel(){
    this.paymentTypeForm.reset();
    this.closeModal();
  }

}
