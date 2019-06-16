import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  paymentType: PaymentType = new PaymentType();
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
              this.onBack();
            },        
            (error: any) => {               
              this.showModalError(this.serviceErrorTitle, <any>error);
            }
          );
    }
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;   
    return true;     
  }

  showModalCancel(template: TemplateRef<any>, idSize: any){
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  cancel(){
    this.onBack();
    this.closeModal();
  }

  onBack() {
    this._router.navigate(['/settings/general/paymentTypes', { outlets: { edit: ['selectItem'] } }]);
  }

}
