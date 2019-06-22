import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';
import { ErrorTemplateComponent } from '../../../shared/components/error-template/error-template.component';
import { Collections } from '../../../shared/enums/collections.enum';
import { SharedService } from '../../../shared/index';

@Component({
  selector: 'app-payment-type-new',
  templateUrl: './payment-type-new.component.html',
  styleUrls: ['./payment-type-new.component.scss']
})
export class PaymentTypeNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  @ViewChild('nameInvalid') nameInvalidTemplate:TemplateRef<any>; 
  
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  paymentType: PaymentType = new PaymentType();
  paymentTypeForm: FormGroup;
  pageTitle: String = 'Nueva Forma de Pago';
  nameIsAvailable: boolean = false;
  currentCollection : string;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _paymentTypeService: PaymentTypeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder,
              private _sharedService: SharedService) { }

  ngOnInit() {
    this.paymentTypeForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: true   
    });
    this.currentCollection = Collections[5];    
  } 

  validateName(){
    let p = Object.assign({}, this.paymentTypeForm.value);
      this._sharedService.validateName(this.currentCollection,p.name)
        .subscribe(result => {
          this.nameIsAvailable = result;
          if(this.nameIsAvailable === true){
            this.savePaymentType();
          }
          else{
            this.modalRef = this.modalService.show(this.nameInvalidTemplate, {backdrop: true});
          }
      })
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
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          );
    }
  }

  showModalError(errorTitleReceived: string, errorMessageReceived: string) { 
    this.modalRef = this.modalService.show(ErrorTemplateComponent, {backdrop: true});
    this.modalRef.content.errorTitle = errorTitleReceived;
    this.modalRef.content.errorMessage = errorMessageReceived;
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
