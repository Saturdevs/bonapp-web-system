import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import { Transaction } from '../../../shared/models/transaction';
import { ClientService } from '../../../shared/services/client.service';
import { CashRegisterService } from '../../../shared/services/cash-register.service';
import { PaymentTypeService } from '../../../shared/services/payment-type.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>; 
  private serviceErrorTitle = 'Error de Servicio';
  private pageTitle: String = 'Detalle'
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  transaction: Transaction;   
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
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        );

        this._cashRegisterService.getCashRegister(this.transaction.cashRegister).subscribe(
          cashRegister => {
            this.transactionCashRegisterName =cashRegister.name;
          },
          error => {
            this.showModalError(this.serviceErrorTitle, error.error.message);
          }
        );
        
      }
    )
  }

  onBack(): void {
    this._router.navigate(['/clients-module/accountTransactions', { outlets: { edit: null } }]);
  }
  
  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;
  }

}
