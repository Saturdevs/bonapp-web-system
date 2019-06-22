import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Component({
  selector: 'app-payment-type-edit',
  templateUrl: './payment-type-edit.component.html',
  styleUrls: ['./payment-type-edit.component.scss']
})
export class PaymentTypeEditComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  paymentType: PaymentType;
  paymentTypeNameModified: String;
  paymentTypeForm: FormGroup;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _paymentTypeService: PaymentTypeService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.paymentTypeForm = this.formBuilder.group({
      name: ['', Validators.required],      
      available: ''   
    });

    this._route.data.subscribe(
      data => {
        this.paymentType = data['paymentType'];
        this.onPaymentTypeRetrieved(this.paymentType);
      }
    )
  }

  updatePaymentType() {
    let paymentTypeUpdate = Object.assign({}, this.paymentType, this.paymentTypeForm.value);
    this._paymentTypeService.updatePaymentType(paymentTypeUpdate).subscribe(
        paymentType => { 
          this.paymentType = paymentType;
          this.onBack();
        },
        error => { 
          this.showModalError(this.serviceErrorTitle, <any>error)
        });
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
    this.modalCancelMessage = "¿Está seguro que desea cancelar los cambios?";
  }

  cancel(){
    this.onBack();
    this.closeModal();
  }

  onPaymentTypeRetrieved(paymentType: PaymentType): void {
    this.paymentType = paymentType;
    this.paymentTypeNameModified = this.paymentType.name;
    this.paymentTypeForm.patchValue({
      name: this.paymentType.name,
      available: this.paymentType.available
    });
  }

  onBack() {
    this._router.navigate(['/settings/general/paymentTypes', { outlets: { edit: ['selectItem'] } }]);
  }
}
 