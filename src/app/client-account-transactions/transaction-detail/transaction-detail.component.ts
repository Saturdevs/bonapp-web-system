import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms/src/directives/ng_form';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Transaction } from '../../../shared/models/transaction';
import { ClientService } from '../../../shared/services/client.service';
import { CashRegister } from '../../../shared/models/cash-register';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { PaymentType } from '../../../shared/models/payment-type';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 

  public modalRef: BsModalRef;
  transaction: Transaction;
  errorMessage: string;  
  transactionPaymentMethodName: String;
  transactionCashRegisterName: String;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _clientService: ClientService,
              private _cashRegisterService: CashRegisterService,
              private _paymentTypeService: PaymentTypeService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this._route.data.subscribe(
      data => {
        this.transaction = data['transaction'];

        this._paymentTypeService.getPaymentType(this.transaction.paymentMethod).subscribe(
          paymentMethod => {
            this.transactionPaymentMethodName = paymentMethod.name;
          },
          error => {
            this.errorMessage = <any>error;
          }
        );

        this._cashRegisterService.getCashRegister(this.transaction.cashRegister).subscribe(
          cashRegister => {
            this.transactionCashRegisterName =cashRegister.name;
          },
          error => {
            this.errorMessage = <any>error;
          }
        );
        
      }
    )
  }

  onBack(): void {
    this._router.navigate(['/clients-module/accountTransactions', { outlets: { edit: null } }]);
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
