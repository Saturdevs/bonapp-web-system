import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

import {
  Client,
  CashRegister,
  PaymentType,
  TransactionService
} from '../../../shared';

@Component({
  selector: 'app-transaction-new',
  templateUrl: './transaction-new.component.html',
  styleUrls: ['./transaction-new.component.scss']
})
export class TransactionNewComponent implements OnInit {

  @ViewChild('errorTemplate') errorTemplate:TemplateRef<any>;   
  private serviceErrorTitle = 'Error de Servicio';
  private cancelButton: String = 'Cancelar';
  private saveButton: String = 'Guardar';
  public modalRef: BsModalRef;
  private modalErrorTittle: string;
  private modalErrorMessage: string;
  private modalCancelTitle: String;
  private modalCancelMessage: String;
  paymentTypes: PaymentType[];
  cashRegisters: CashRegister[];
  clients: Client[];
  pageTitle: String = 'Nueva Transacción';
  newTransaction;
  hasCashRegister = true;
  showMessageCashRegister = false;
  hasPaymentType = true;
  showMessagePaymentType = false;
  hasClient = true;
  showMessageClient = false;
  lengthCashRegister: Boolean;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _transactionService: TransactionService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.newTransaction = {};
    this.newTransaction.cashRegister = "default";
    this.newTransaction.client = "default";
    this.newTransaction.paymentType = "default";

    this._route.data.subscribe(
      data => {
        this.cashRegisters = data['cashRegisters']
      }
    )

    this._route.data.subscribe(
      data => {
        this.paymentTypes = data['paymentTypes']
      }
    )

    this._route.data.subscribe(
      data => {
        this.clients = data['clients']
      }
    )

    this.shouldDisplayCashRegisterCombo();
  }

  private shouldDisplayCashRegisterCombo() {
    if (this.cashRegisters.length != 0) {
      if (this.cashRegisters.length > 1) {
        this.lengthCashRegister = true;
      }
      else {
        this.newTransaction.cashRegister = this.cashRegisters[0]._id;
        this.lengthCashRegister = false;
        this.hasCashRegister = false;
      }
    }
    else {
      this.lengthCashRegister = false;
      this.hasCashRegister = false;
    }
  }

  saveTransaction(){
    this._transactionService.saveTransaction(this.newTransaction).subscribe(
      transaction => {
        this.onBack();
      },
      error => {
        this.showModalError(this.serviceErrorTitle, error.error.message);
      }
    )  
  }

  showModalError(errorTittleReceived: string, errorMessageReceived: string) { 
    this.modalErrorTittle = errorTittleReceived;
    this.modalErrorMessage = errorMessageReceived;
    this.modalRef = this.modalService.show(this.errorTemplate, {backdrop: true});        
  }

  showModalCancel(template: TemplateRef<any>, idCashRegister: any){    
    this.modalRef = this.modalService.show(template, {backdrop: true});
    this.modalCancelTitle = "Cancelar Cambios";
    this.modalCancelMessage = "¿Está seguro que desea salir sin guardar los cambios?";
  }

  onBack(): void {
    this._router.navigate(['/clients-module/current-accounts', { outlets: { edit: ['selectItem'] } }]);
  }

  validateCashRegister(value) {   
    if (value === 'default') {
      this.hasCashRegister = true;
      this.showMessageCashRegister = true;
    } else {
      this.hasCashRegister = false;
      this.showMessageCashRegister = false;
    }
  }

  validatePaymentType(value) { 
    if (value === 'default') {
      this.hasPaymentType = true;
      this.showMessagePaymentType = true;
    } else {
      this.hasPaymentType = false;
      this.showMessagePaymentType = false;
    }
  }

  validateClient(value) {   
    if (value === 'default') {
      this.hasClient = true;
      this.showMessageClient = true;
    } else {
      this.hasClient = false;
      this.showMessageClient = false;
    }
  }

  closeModal(){
    this.modalRef.hide();
    this.modalRef = null;    
  }

  cancel(){    
    this.onBack();
    this.closeModal();
  }

}
